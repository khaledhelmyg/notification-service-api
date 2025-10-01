import { Router } from "express";
import {
  sendNotification,
  getNotifications,
  notificationCount,
  markAsRead,
  deleteNotification,
  markAllForUserAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.route("/").post(sendNotification).get(getNotifications);
router.route("/count").get(notificationCount);
router.route("/seen-all/:userId").patch(markAllForUserAsRead);
router.route("/seen/:notificationId").patch(markAsRead);

router.route("/:notificationId").delete(deleteNotification);

export default router;
