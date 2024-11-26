const db = require('../database/models/index');
const Paystack = require('../services/paystack.service');
const Store = db.store;
const Payment = db.payment;
const Transaction = db.subscription;
const Subscription = db.subscription;

const paymentMethods = ['card', 'bank'];

class PaymentController {
    static async Initialize(req, res, next) {
        const { currency, amount, storeid, payment_method } = req.data;

        if (!paymentMethods.includes(payment_method)) {
            throw new InternalServerError('payment method not accepted');
        }

        const store = await Store.findOne({ where: { id: storeid } });
        if (!store) {
            throw new InternalServerError('Store with the store id not found');
        }

        const storetype = await Store.findOne({ where: { id: store.storetypeid } });
        if (!store) {
            throw new InternalServerError('internal error');
        }

        const subscription = await Subscription.findOne({ where: { id: store.storetype.subscriptionId } });
        if (!store) {
            throw new InternalServerError('internal error');
        }

        const newTransaction = await Transaction.Create({
            currency: currency,
            amount: amount,
            storeid: storeid,
            subscriptionId: storetype.subscription.id,
            status: 'pending',
        });

        if (!newTransaction) {
            res.status(200).json({
                status: 'failed',
                message: 'transaction initiation failed',
                data: null,
            });
            return;
        }

        const transaction_data = {
            email: store.email,
            plan: subscription.code,
            channel: payment_method,
        };
        const data = await Paystack.Transaction.Initialize(transaction_data);

        if (!data?.status || !data?.data) {
            res.status(200).json({
                status: 'failed',
                message: 'transaction initiation failed',
                data: null,
            });
            return;
        }

        const { access_code, authorization_url, reference } = data.data;
        newTransaction.code = access_code;
        newTransaction.reference = data.reference;
        await newTransaction.save();

        res.status(201).json({
            status: 'success',
            message: 'transaction successfully initiated',
            data: null,
        });
    }

    static async Confirm(req, res, next) {
        const reference = req.params.reference;
        if (reference === '') {
            res.status(201).json({
                status: 'failed',
                message: 'payment reference required',
                data: null,
            });
        }

        const { status, data } = await Paystack.Transaction.Verify(reference);

        const transaction = Transaction.findOne({ where: { reference: reference } });
        if (!transaction) {
            throw new InternalServerError('Payment not valid');
        } else if (status && data.status === 'failed') {
            transaction.status = 'failed';
            await transaction.save();

            const newPayment = Payment.create({
                transactionid: transaction.id,
                gateway: 'paystack',
                total: data.amount,
                status: 'failed',
                currency: data.currency,
                method: data.channel,
                extra: JSON.stringify(data),
            });

            res.status(201).json({
                status: 'failed',
                message: 'payment not successful',
                data: newPayment.total,
            });
            return;
        }

        const subscribeData = await Paystack.Subscription.Create(data);

        if (!subscribeData.status) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription failed',
                data: null,
            });
            return;
        }

        transaction.status = 'success';
        await transaction.save();

        const newPayment = Payment.create({
            transactionid: transaction.id,
            gateway: 'paystack',
            total: data.amount,
            status: 'sucess',
            currency: data.currency,
            method: data.channel,
            extra: JSON.stringify(data),
        });

        if (!newPayment) {
            res.status(200).json({
                status: 'failed',
                message: 'payment confirmation failed',
                data: null,
            });
            return;
        }

        res.status(201).json({
            status: 'success',
            message: 'payment made successfully',
            data: newPayment.total,
        });
    }

    static async CreatePlan(req, res, next) {
        const { currency, name, interval, amount } = req.body;

        const data = {
            name: name,
            interval: interval,
            amount: amount * 100,
            currency: currency,
        };

        const planData = Paystack.Plan.Create(data);

        if (!planData?.status || !planData?.data) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription creation failed ',
                data: null,
            });
        }

        const { plan_code } = planData.data;
        const newSubscription = await Subscription.create({
            currency: currency,
            name: name,
            interval: interval,
            amount: amount,
            code: plan_code,
            status: 'pending',
        });

        if (!newSubscription) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription creation failed ',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'subscription creation successfull ',
            data: null,
        });
    }

    static async Webhook(req, res, next) {
        //validate event
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
            // Retrieve the request's body
            const event = req.body;
            // Do something with event
            Paystack.HandleEvent(event);
        }
        res.send(200);
    }
}

module.exports = PaymentController;
