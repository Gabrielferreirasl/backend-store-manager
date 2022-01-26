const connection = require('./connection');

const createSale = async (arrSales) => {
    const [{ insertId: idFromSale }] = await connection.execute('INSERT INTO sales VALUES ()');

    let query = 'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES ';
    const arrQuery = [];

    arrSales.forEach(({ product_id: productId, quantity }, index) => {
        query += index === arrSales.length - 1 ? '(?, ?, ?);' : '(?, ?, ?), ';
        arrQuery.push(idFromSale, productId, quantity);
    });

    await connection.execute(query, arrQuery);
        
    return idFromSale;
};

const getAll = async () => {
  const [sales] = await connection.execute(
    `SELECT a.sale_id as saleId, a.product_id, a.quantity, b.date
    FROM sales_products a
    JOIN sales as b
    ON a.sale_id = b.id`,
);
  return sales;
};

const getById = async (id) => {
    const [sales] = await connection.execute(
        `SELECT date, product_id, quantity FROM sales as a
         INNER JOIN sales_products as b WHERE b.sale_id = ?`,
        [id],
    );

    return sales;
};

const edit = async (arrProducts, id) => {
    const query = `UPDATE sales_products
    SET quantity = ?
    WHERE sale_id = ? AND product_id = ?`;

    await Promise.all(
        arrProducts
        .map(({ product_id: productId, quantity }) => connection
        .execute(query, [quantity, id, productId])),
        );
};

const deleteSale = async (id) => {
    await connection.execute(
        `DELETE FROM sales
        WHERE id = ?`,
        [id],
    );
};

module.exports = {
    createSale,
    getAll,
    getById,
    edit,
    deleteSale,
};