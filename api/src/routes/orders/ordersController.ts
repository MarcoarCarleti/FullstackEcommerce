import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/ordersSchema.js";
import { eq } from "drizzle-orm";
import { productsTable } from "../../db/productsSchema.js";

export async function createOrder(req: Request, res: Response) {
  try {
    const { order, items } = req.cleanBody;

    const userId = req.userId;
    console.log(userId);
    if (!userId) {
      res.status(400).json({ message: "Invalid order data" });
    }

    const [newOrder] = await db
      .insert(ordersTable)
      // @ts-ignore
      .values({ userId: userId })
      .returning();

    // TODO: validate products ids, and take their actual price from db
    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id,
    }));
    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(201).json({ ...newOrder, items: newOrderItems });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Invalid order data", error: e });
  }
}

// if req.role is admin, return all orders
// if req.role is seller, return orders by sellerId
// else, return only orders filtered by req.userId
export async function listOrders(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ message: "Invalid order data" });
    }

    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, Number(userId)));
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const orderWithItemsAndProducts = await db
      .select({
        order: ordersTable,
        orderItem: orderItemsTable,
        product: productsTable,
      })
      .from(ordersTable)
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
      .where(eq(ordersTable.id, id));

    if (orderWithItemsAndProducts.length === 0) {
      res.status(404).send("Order not found");
    }

    const mergedOrder = {
      ...orderWithItemsAndProducts[0].order,
      items: orderWithItemsAndProducts.map((oi) => ({
        ...oi.orderItem,
        product: oi.product,
      })),
    };

    res.status(200).json(mergedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const [updatedOrder] = await db
      .update(ordersTable)
      .set(req.body)
      .where(eq(ordersTable.id, id))
      .returning();

    if (!updatedOrder) {
      res.status(404).send("Order not found");
    } else {
      res.status(200).json(updatedOrder);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
