const express = require('express');
const { connect } = require('./db/conn')
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');



const app = express();
const port = process.env.MONGO_URI || 4000;

const generateToken = (userId: any, isAdmin: any) => {
    const payload = { userId, isAdmin };
    const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
    return token;
};

app.use(cors());
app.use(express.json());



app.get('/', async (req: Request, res: any) => {
    try {
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('products').find({}).toArray();
        res.json(result);
        
    } catch (error) {
        console.log(error)
    } 
});

app.post('/', async (req: any, res: any) => {
    try {
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('products').insertOne({
            'image': req.body.image,
            'title': req.body.title,
            'price': req.body.price,
            'short_description': req.body.short_description,
            'long_description': req.body.long_description,
            'type': req.body.type,
            'amount': req.body.amount
        });
        res.json(result);
    } catch (error) {
        console.log(error)
    } 
});

app.delete('/', async (req: any, res: any) => {
    try {
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('products').deleteOne({ title: req.body.title });
        res.json(result);
    } catch (error) {
        console.log(error)
    } 
});

app.put('/', async (req: any, res: any) => {
    try {
        const { findTitle } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        const findProduct = await db.collection('products').findOne({ title: findTitle });        
        if (!findProduct) {
            res.json(findProduct);
        } else {
            const result = await db.collection('products').updateOne(
                { title: findTitle },
                { $set: req.body }
            );
            res.json(result)
        }
    } catch (error) {
        console.log(error)
    }
});

app.get('/opinions', (req: Request, res: any) => {
    connect()
        .then((client: any) => {
            const db = client.db("only_store");
            return db.collection('opinions').find({}).toArray();
        })
        .then((result: any) => {
            res.json(result);
        })
        .catch((error: any) => {
            console.log(error);
        });
});

app.post('/opinions', (req: Request, res: any) => {
    connect()
        .then((client: any) => {
            const db = client.db("only_store");
            return db.collection('opinions').insertOne(req.body);
        })
        .then((result: any) => {
            res.json(result);
        })
        .catch((error: any) => {
            console.log(error);
        });
});

app.delete('/opinions', (req: any, res: any) => {
    connect()
        .then((client: any) => {
            const db = client.db("only_store");
            return db.collection('opinions').deleteOne({ _id: new ObjectId(req.body._id) });
        })
        .then((result: any) => {
            res.json(result);
        })
        .catch((error: any) => {
            console.log(error);
        });
});

app.patch('/opinions', (req: any, res: any) => {
    const { _id, test_opinion } = req.body;
    connect()
        .then((client: any) => {
            const db = client.db("only_store");
            return db.collection('opinions').findOne({ _id: new ObjectId(_id) });
        })
        .then((findOpinion: any) => {
            if (!findOpinion) {
                res.json(findOpinion);
            } else {
                return connect()
                    .then((client: any) => {
                        const db = client.db("only_store");
                        return db.collection('opinions').updateOne(
                            { _id: new ObjectId(_id) },
                            { $set: { test_opinion: test_opinion } }
                        );
                    })
                    .then((result: any) => {
                        res.json(result);
                    });
            }
        })
        .catch((error: any) => {
            console.log(error);
        });
});

app.get('/search', async (req: any, res: any) => {
    try {
        const { type, title, sortBy, minPrice, maxPrice } = req.query;
        const pipeline = [];

        if (type && title) {
            pipeline.push({ $match: { "type": type, title: { $regex: new RegExp(title, 'i') } } });
        } else if (title) {
            pipeline.push({ $match: { title: { $regex: new RegExp(title, 'i') } } });
        } else if (type) {
            pipeline.push({ $match: { "type": type } });
        }

        if (sortBy === 'avgRating') {
            pipeline.push({ $sort: { averageRating: -1 } });
          } else if (sortBy) {
            pipeline.push({ $sort: { price: sortBy === 'asc' ? 1 : -1 } });
          }

        if (minPrice) {
            pipeline.push({ $match: { price: { $gte: parseFloat(minPrice) } } });
          }
          
          if (maxPrice) {
            pipeline.push({ $match: { price: { $lte: parseFloat(maxPrice) } } });
          }

        pipeline.push({
            $project: {
                _id: 1,
                image: 1,
                title: 1,
                price: 1,
                short_description: 1,
                long_description: 1,
                amount: 1
            }
        });

        const client = await connect();
        const db = client.db("only_store");

        const result = await db.collection('products')
            .aggregate(pipeline)
            .toArray();

        console.log(result)
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.post('/register', async (req: any, res: any) => {
    try {

        const { name, email, password } = req.body;
        
        const client = await connect();
        const db = client.db("only_store");
        const existingAccount = await db.collection('accounts').findOne({ "email": email });
        if (existingAccount) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('accounts').insertOne({
            'name': name,
            'email': email,
            'password': hashedPassword,
        });
        const token = generateToken(result.insertedId, false);

        res.json({ result, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req: any, res: any) => {
    
    try {

        const { email, password } = req.body;
        const client = await connect();
        const db = client.db("only_store");
        const existingAccount = await db.collection('accounts').findOne({ "email": email });
        if (!existingAccount) {
            return res.status(400).json({ error: 'Email not registered' });
        }

        const passwordCorrect = await bcrypt.compare(password, existingAccount.password);
        if (!passwordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(existingAccount._id, existingAccount.isAdmin || false);

        if (email === 'admin@admin.com') {
            res.json({ status: 'Login Successful', isAdmin: true, name: existingAccount.name, token, email: existingAccount.email });
          } else {
            res.json({ status: 'Login Successful', name: existingAccount.name, token, email: existingAccount.email  });
          }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/cart', async (req: any, res: any) => {
    try {
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('shopping_cart').find({}).toArray();
        res.json(result);
    } catch (error) {
        console.log(error)
    } 
});

app.post('/cart', async (req: any, res: any) => {
    try {
        const { _id, title, image, price } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        const existingProduct = await db.collection('shopping_cart').findOne({ _id: _id });

        if (existingProduct) {
            const updatedAmount = existingProduct.amount + 1;
            await db.collection('shopping_cart').updateOne(
                { _id: _id },
                { $set: { amount: updatedAmount } }
            );
        } else {
            await db.collection('shopping_cart').insertOne(
                {
                    _id: _id,
                    title: title,
                    image: image,
                    price: price,
                    amount: 1
                }
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/cart/:_id', async (req: any, res: any) => {
    try {
        const productId = req.params._id;
        const client = await connect();
        const db = client.db("only_store");
        const existingProduct = await db.collection('shopping_cart').findOne({ _id: productId });

        if (existingProduct) {
            const updatedAmount = existingProduct.amount - 1;

            if (updatedAmount > 0) {
                await db.collection('shopping_cart').updateOne(
                    { _id: productId },
                    { $set: { amount: updatedAmount } }
                );
            } else {
                await db.collection('shopping_cart').deleteOne({ _id: productId });
            }

            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Product not found in the shopping cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/star_rating/:productId', async (req: any, res: any) => {
    try {
        const productId = req.params.productId;
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('star_rating').aggregate([
            { $match: { productId: productId } },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: '$rating' }
                }
            }
        ]).toArray();
        console.log(result[0])
        res.json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/star_rating', async (req: any, res: any) => {
    try {
        const { productId, rating } = req.body;
        const client = await connect();
        const db = client.db("only_store");


            await db.collection('star_rating').insertOne(
                {
                    productId: productId,
                    rating: rating
                }
            );
        

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/star_rating', async (req: any, res: any) => {
    try {
        const { _id } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        await db.collection('star_rating').deleteOne({ _id: new ObjectId(_id)});
        res.json({ success: true });
    } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
    }
    });

app.patch('/star_rating', async (req: any, res: any) => {
    try {
        const { _id, rating } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        const existingRating = await db.collection('star_rating').findOne({ _id: new ObjectId(_id) });
        console.log(existingRating)
        if (existingRating) {
            await db.collection('star_rating').updateOne(
                { _id: new ObjectId(_id) },
                { $set: { productId: existingRating.productId, rating: rating} },
            );
        } else {
            await db.collection('star_rating').insertOne(
                {
                    _id: new ObjectId(_id),
                    productId: existingRating.productId,
                    rating: rating
                }
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/deliveries', async (req: any, res: any) => {
    try {
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('deliveries').find({}).toArray();
        console.log(result)
        res.json(result);
    } catch (error) {
        console.log(error)
    } 
});

app.post('/deliveries', async (req: any, res: any) => {
    try {
        const { title, price, time } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        await db.collection('deliveries').insertOne(
            {
                title: title,
                price: price,
                time: time
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deliveries', async (req: any, res: any) => {
    try {
        const { _id } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        await db.collection('deliveries').deleteOne({ _id: new ObjectId(_id)});
        res.json({ success: true });
    } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
    }
    }
);

app.patch('/deliveries', async (req: any, res: any) => {
    try {
        const { _id, title, price, time } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        const existingDelivery = await db.collection('deliveries').findOne({ _id: new ObjectId(_id) });
        if (existingDelivery) {
            await db.collection('deliveries').updateOne(
                { _id: new ObjectId(_id) },
                { $set: { title: title, price: price, time: time} },
            );
        } else {
            await db.collection('deliveries').insertOne(
                {
                    _id: new ObjectId(_id),
                    title: title,
                    price: price,
                    time: time
                }
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/orders', async (req: any, res: any) => {
    try {
        const { name, surname, email, phone, address, city, zipCode, delivery, payment, products, price } = req.body;
        const client = await connect();
        const db = client.db("only_store");

        await db.collection('orders').insertOne(
            {
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                address: address,
                city: city,
                zipCode: zipCode,
                delivery: delivery,
                payment: payment,
                products: products,
                price: price
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/orders/:email', async (req: any, res: any) => {
    try {
        const email = req.params.email;
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('orders').find({ email: email }).toArray();
        console.log(result)
        res.json(result);
    } catch (error) {
        console.log(error)
    }
});


app.get('/banners', async (req: any, res: any) => {
    try {
        const client = await connect();
        const db = client.db("only_store");
        const result = await db.collection('banners').find({}).toArray();
        console.log(result)
        res.json(result);
    } catch (error) {
        console.log(error)
    } 
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});