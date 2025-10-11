import express, { Router } from "express"

const playlistRouter = express.Router();

playlistRouter.route("/").get(AsyncHandler(isLoggedIn), AsyncHandler(getAllListDetails));
playlistRouter.route("/:playlistId").get(AsyncHandler(isLoggedIn), AsyncHandler(getPlayListDetails));
playlistRouter.route("/create-playList").post(AsyncHandler(isLoggedIn), AsyncHandler(createPlaylist));
playlistRouter.route("/:playlistId/add-problem").post(AsyncHandler(isLoggedIn), AsyncHandler(addproblemToPlaylist));
playlistRouter.route("/:playlistId").delete(AsyncHandler(isLoggedIn), AsyncHandler(deletePlaylist));
playlistRouter.route("/:playlistId/remove-problem").delete(AsyncHandler(isLoggedIn), AsyncHandler(removeProblemFromPlayList));

export default playlistRouter;