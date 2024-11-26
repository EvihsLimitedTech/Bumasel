const { where } = require('sequelize');
const db = require('../database/models/index');
const slug = require('../utils/slug')
const Store = db.store
const StoreType = db.storetype
const Subscription = db.subscription



class StoreController {
    static async createStore(req , res , next) {
        const {
            name,
            description,
            contact1,
            contact2,
            email,
            country,
            state,
            city,
            address,
            institution,
            storetypeid,
        } = req.body;

        const newStore = await Store.create({
            name:name,
            slug:slug.slug(name),
            description:description,
            contact1:contact1,
            contact2:contact2,
            email:email,
            country:country,
            state:state,
            city:city,
            address:address,
            institution:institution,
            storetypeid:storetypeid,
        })

        if(!newStore) {
            res.status(201).json({
                status: 'failed',
                message: 'store creation failed',
                data:null,
            });
            return
        }
        res.status(201).json({
            status: 'success',
            message: 'store successfully created',
            data:{store:newStore.dataValues},
        });
    }

    static async updateStore(req , res , next){
        if (req.params.id === "") {
            res.status(201).json({
                status: 'failed',
                message: 'store id not valid',
                data:{store:newStore.dataValues},
            });
            return
        } 
        const {
            name,
            description,
            contact1,
            contact2,
            email,
            country,
            state,
            city,
            address,
            institution,
        } = req.body;

        const updatedStore = await Store.update({
            name:name,
            slug:slug.slug(name),
            description:description,
            contact1:contact1,
            contact2:contact2,
            email:email,
            country:country,
            state:state,
            city:city,
            address:address,
            institution:institution,
        } , {where:{id:req.params.id}})

        if(!updatedStore) {
            res.status(200).json({
                status: 'failed',
                message: 'store update failed',
                data:null,
            });
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'store successfully updated',
            data:{store:updatedStore[0]},
        });
    }

    static async getStoreById(req , res , next){
        if (req.params.id === "" || req.params.id === undefined) {
            res.status(200).json({
                status: 'failed',
                message: 'store slug not valid',
                data:null,
            });
            return
        }
        const store =await Store.findOne({where:{id:req.params.id}})
        if(!store) {
            res.status(400).json({
                status: 'failed',
                message: 'store not found',
                data:null,
            });
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'store retrieved successfull',
            data:store,
        });
    }
    static async getStoreBySlug(req , res , next){
        if (req.params.slug === "" || req.params.slug === undefined) {
            res.status(200).json({
                status: 'failed',
                message: 'store slug not valid',
                data:null,
            });
            return
        }
        const store =await Store.findOne({where:{slug:req.params.slug}})
        if(!store) {
            res.status(400).json({
                status: 'failed',
                message: 'store not found',
                data:null,
            });
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'store retrieved successfull',
            data:store,
        });
    }

    static async deleteStore(req , res , next){
        if (req.params.id === "") {
            res.status(201).json({
                status: 'failed',
                message: 'store id not valid',
                data:null,
            });
            return
        } 
        await Store.destroy({where:{id:req.params.id}})
        res.status(200).json({
            status: 'success',
            message: 'store successfully deleted',
            data:null,
        });
    }

    static async createStoreType(req , res , next) {
        const {
            subscriptionid,

        } =  req.body

        const subscription = Subscription.findOne({where:{id:subscriptionid}})

        if (!subscription) {
            res.status(200).json({
                status: 'failed',
                message: 'store type creation failed',
                data:null,
            });
            return
        }

        const {name , amount}  = subscription
        const newStoreType = await StoreType.create({
           title:name,
           price:amount,
        })

        if (!newStoreType) {
            res.status(200).json({
                status: 'failed',
                message: 'store type creation failed',
                data:null,
            });
            return
        }

        res.status(201).json({
            status: 'success',
            message: 'store type creation successfull',
            data:newStoreType,
        });
    }

    static async getStoreType(req , res , next) {
        if (req.params.id === "") {
            res.status(200).json({
                status: 'failed',
                message: 'store type id not valid',
                data:null,
            });
            return
        } 
        const store_type =await StoreType.findByPk(req.params.id)
        if(!store_type) {
            res.status(400).json({
                status: 'failed',
                message: 'store type retrieval failed',
                data:store_type,
            });
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'store type retrieved successfully',
            data:store_type,
        });
    }
    
    static async listStoreTypes(req , res , next) {
        
        const store_types =await StoreType.findAll()
        if(!store_types) {
            res.status(400).json({
                status: 'failed',
                message: 'store types not retrieved ',
                data:null,
            });
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'store types retrieved succcessfully ',
            data:store_types,
        });
    }

    static async deleteStoreType(req , res , next){
        if (req.params.id === "") {
            res.status(200).json({
                status: 'failed',
                message: 'store type id not valid',
                data:null,
            });
            return
        } 
        await StoreType.destroy({where:{id:req.params.id}})
        res.status(200).json({
            status: 'success',
            message: 'store type successfully deleted',
            data:null,
        });
    }

}

module.exports = StoreController