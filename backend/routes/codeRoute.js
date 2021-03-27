import express from 'express';
import User from '../models/userModel';
import Product from '../models/productModel';
import Code from '../models/codeModel';

const router = express.Router();

router.get('/:id/invite', async (req, res) => {
  console.log("GET CODE INVITE " + req.params.id);
  const user = await User.findOne({ id: req.params.id });
  if (user) {
    var invitecode = Math.floor(Math.random() * 99998) + 1;
    const code = new Code({
        id: req.params.id,
        codetype: 2,    // 1 IS A GIFT, 2 IS AN INVITE
        code: invitecode,
    });
    try {
        const newCode = await code.save()
        res.send({code: invitecode});
    } catch(e) {
        console.log("BARF AND RETRY " + e);
        code.code = Math.floor(Math.random() * 99998) + 1;
        try {
            const newCode = await code.save();
            res.send({code: giftcode});
        } catch(e) {
            res.status(301).send({ message: 'Can\'t get code.' });
        }
    }
  } else {
        res.status(404).send({ message: 'User Not Found.' });
  }
});

router.get('/:id/gift', async (req, res) => {
  console.log("GET CODE GIFT " + req.params.id);
  const user = await User.findOne({ id: req.params.id });
  if (user) {
    var giftcode = Math.floor(Math.random() * 99998) + 1;
    const code = new Code({
        id: req.params.id,
        codetype: 1,    // 1 IS A GIFT, 2 IS AN INVITE
        code: giftcode,
    });
    try {
        const newCode = await code.save()
        res.send({code: giftcode});
    } catch(e) {
        console.log("BARF AND RETRY " + e);
        code.code = Math.floor(Math.random() * 99998) + 1;
        try {
            const newCode = await code.save();
            res.send({code: giftcode});
        } catch(e) {
            res.status(301).send({ message: 'Can\'t get code.' });
        }
    }
  } else {
        res.status(404).send({ message: 'User Not Found.' });
  }
});

export default router;
