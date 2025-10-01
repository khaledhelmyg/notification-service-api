import prisma from "../config/prisma.config";
import { ApiFeatures } from "../utils/apiFeatures.utils";

const createNotification = async (data: any) => {
  const notification = await prisma.notification.create({
    data,
  });
  return notification;
};

const findNotifications = async (queryString: any) => {
  const features = new ApiFeatures(queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search(["title", "body"]);

  const notifications = await prisma.notification.findMany(features.build());

  return notifications;
};

const getNotificationCount = async (queryString: Object) => {
  const features = new ApiFeatures(queryString).filter();
  const { where } = features.build();
  const count = await prisma.notification.count({ where });
  return {count};
};

const markOneAsRead = async (notificationId: string) => {
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
  return notification;
};
const markAllAsRead = async (userId: string) => {
  const notification = await prisma.notification.updateMany({
    where: { userId: userId },
    data: { isRead: true },
  });
  return notification;
};

const deleteNotificationById = async (
  notificationId: string
): Promise<void> => {
  await prisma.notification.deleteMany({
    where: { id: notificationId },
  });
};

export {
  createNotification,
  findNotifications,
  markOneAsRead,
  markAllAsRead,
  deleteNotificationById,
  getNotificationCount,
};
