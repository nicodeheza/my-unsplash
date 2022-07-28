import {Router} from "express";
import addPhoto from "../controllers/addPhoto";
import deletePhoto from "../controllers/deletePhoto";
import isAdmin from "../middlewares/isAdmin";
import getPhotos from "../controllers/getPhotos";

const router = Router();

router.post("/image", addPhoto);
router.delete("/image", isAdmin, deletePhoto);
router.get("/images", getPhotos);

export default router;
