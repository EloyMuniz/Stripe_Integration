import express, { Router } from "express";
import StripeController from "../src/Controllers/StripeController";

const stripeRouter = Router()

stripeRouter.post("/stripe-webhook", express.raw({ type: 'application/json' }), StripeController.stripeFlow)
export default stripeRouter