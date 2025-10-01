import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import {
  createNotification,
  findNotifications,
  markOneAsRead,
  markAllAsRead,
  deleteNotificationById,
  getNotificationCount,
} from "../services/notification.service";

export const sendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await createNotification(req.body);
    res.status(201).send(notification);
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const notifications = await findNotifications(req.query);
    res.status(200).send(notifications);
  } catch (error) {
    next(error);
  }
};

export const notificationCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getNotificationCount(req.query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;
    const notification = await markOneAsRead(notificationId);
    if (!notification) {
      throw createHttpError.Conflict(" Failed to update Notification");
    }
    res.status(200).send(notification);
  } catch (error) {
    next(error);
  }
};
export const markAllForUserAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const result = await markAllAsRead(userId);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;
    await deleteNotificationById(notificationId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


