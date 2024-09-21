const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 数据库连接
const db = mysql.createConnection({
    host: 'localhost', // 例如 'localhost'
    user: 'root', // 数据库用户名
    password: 'yyx05260226', // 数据库密码
    database: '三棵树产品库存' // 数据库名称
});

// 连接数据库
db.connect((err) => {
    if (err) throw err;
    console.log('数据库连接成功');
});

// 提交订单的处理函数
app.post('/submit-order', (req, res) => {
    const orderData = req.body; // 获取订单数据
    const productName = orderData.productName; // 假设你传递了产品名称
    const quantity = orderData.quantity; // 假设你传递了数量

    // 从数据库中获取产品信息
    db.query('SELECT quantity FROM products WHERE product_name = ?', [productName], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const currentQuantity = results[0].quantity;
            if (currentQuantity >= quantity) {
                // 更新库存
                const newQuantity = currentQuantity - quantity;
                db.query('UPDATE products SET quantity = ?, lastupdated = NOW() WHERE product_name = ?', [newQuantity, productName], (err) => {
                    if (err) throw err;
                    res.send('库存更新成功');
                });
            } else {
                res.status(400).send('库存不足');
            }
        } else {
            res.status(404).send('产品未找到');
        }
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器在 http://localhost:${port} 运行`);
});