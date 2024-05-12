import { Request, Response } from 'express';
import { Stripe } from 'stripe';
import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
import moment from "moment"
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
//Alterar para ambiente de produção
if (process.env.STANDARDKEYLIVE) {
    var stripe = new Stripe(
        process.env.STANDARDKEYLIVE,
        {
            apiVersion: "2024-04-10",
        }
    );
} else {
    console.error("A chave do ambiente não está definida.");
}

//     process.env.ENDPOINTLOCALLUC;

//Stripe Eloy
// const endpointSecret =
//     process.env.ENDPOINTPRODELOY
const endpointSecret = process.env.ENDPOINTLOCALELOY


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,

    secure: true,
    auth: {
        user: "",//Email 
        pass: process.env.PASSGMAIL,
    },
    tls: {
        rejectUnauthorized: true, //Usar "false" para ambiente de desenvolvimento
    },
});

interface User {

}
const current_data = moment().format('YYYY-MM-DD')
class StripeController {

    public async stripeFlow(req: Request, res: Response) {
        try {

            const sig: string | string[] | undefined = req.headers['stripe-signature'];
            if (typeof sig !== 'string') {
                res.status(400).send('Invalid Stripe Signature');
                return;
            }
            let event;

            try {
                if (typeof endpointSecret !== 'string') {
                    res.status(400).send('Invalid endPoint!');
                    return;
                }

                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

            } catch (err: any) {

                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
            const product_1 = "123456" //Aqui fica o meta_dado para distinguir produto de produto

            switch (event.type) {
                //Não usaremos esse caso/evento
                case 'payment_intent.succeeded':
                    const paymentIntentSucceeded = event.data.object;

                    break;
                case 'checkout.session.completed':
                    const checkout = event.data.object;
                    console.log(checkout)
                    if (checkout && checkout.metadata && checkout.metadata.product_id !== undefined) {

                        const product_id = checkout.metadata.product_id;
                        if (product_id == product_1) {
                            const amount = checkout.amount_total;

                            if (typeof amount === 'number') {
                                const quant = 10

                                const customer_email = checkout.customer_details ? checkout.customer_details.email : 'N/A';
                                const result = await prisma.use_users.findFirst({
                                    where: { use_email: customer_email }
                                })

                                if (result) {
                                    const existingQuantResult = await prisma.use_users.findFirst({ select: { use_quant: true }, where: { use_email: customer_email } });
                                    //Somará os que ja tem
                                    const quantidade = existingQuantResult?.use_quant || 0;
                                    await prisma.use_users.updateMany({
                                        data: {
                                            use_date_expire: current_data,
                                            use_quant: quant + quantidade,

                                        },
                                        where: { use_email: customer_email }
                                    })


                                } else {
                                    const sum = quant
                                    const randomPassword = Math.random().toString(36).slice(-4);

                                    const saltRounds = 10;
                                    const passwordHash: string = bcrypt.hashSync(randomPassword, saltRounds);
                                    await prisma.use_users.create({
                                        data: {
                                            use_date_expire: current_data,
                                            use_email: customer_email,
                                            use_quant: sum,
                                            use_password: passwordHash,
                                        }
                                    })
                                    const emailBody = `
                                    <p>Olá,</p>
                                    <p>Agradecemos por se cadastrar! Você pode acessar sua conta com o  <strong>login:</strong> ${customer_email},  <strong>senha:</strong> ${randomPassword} e a quantidade de créditos que você tem é: ${sum}. Enviamos 3 créditos gratuitos para você!</p>
                    
                                `;
                                    if (customer_email != null) {
                                        const mailOptions = {
                                            from: "",
                                            to: [customer_email],
                                            subject: "Registro usuário",
                                            html: emailBody,
                                        };

                                        // Enviar o email
                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) {
                                                console.error(error);
                                                return res.status(500).json({ message: "Erro ao enviar o email." });
                                            } else {
                                                return res.status(200).json({

                                                    message: "Email enviado com sucesso! ",
                                                });
                                            }
                                        });
                                        return res.status(200).json({ message: "O usuário foi salvo no banco de dados com sucesso!" })
                                    }
                                }


                            } else {
                                console.log("Amount não é um número!");
                            }
                        } else {

                            return res.status(204).json({ message: "Esse não é um produto da linha!" });
                        }
                    } else {
                        return res.status(204).json({ message: "Não há identificador de produto!" });
                    }
                default:
                    console.log(`Unhandled event type ${event.type}`);

            }

        } catch (error) {

            return res.status(500).json({ message: 'Erro ao receber os dados!' });
        }

    }

}

export default new StripeController