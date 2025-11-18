import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";


const createPlaylist = async(req, res) => {
    const {name, description} = req.body;
    const userId = req.user.id;

    const playlist = await db.playlist.create({
        data:{
            name,
            description,
            userId,
        },
    });

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"));

}

const getAllListDetails = async(req, res) => {
    const playlists = await db.playlist.findMany({
        where: {
            userId: req.user.id,
        },
        include: {
            problems:{
                include:{
                    problem: true,
                }
            }
        }
    });

    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));

}

const getPlayListDetails = async(req, res) => {
    const playlistId = req.params
    const playlist = await db.playlist.findUnique({
        where: {
            id: playlistId,
            userId: req.user.id,
        },
        include: {
            problems:{
                include:{
                    problem: true,
                }
            }
        }
    });

    if(!playlist){
        throw new ApiError(
          404,
          "Playlist not found"
        );
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));

}


const addproblemToPlaylist = async (req, res) => {
    const {playlistId} = req.params;
    const {problemIds} = req.body; //accepting an array

    if(!Array.isArray(problemIds) || problemIds.length == 0){
        throw new ApiError(400, "Invalid or missing problem Ids");
    }

    console.log("in playlist controller", problemIds)

    console.log("in playlist controller---2",
        problemIds.map((problemId)=>{
            return {playlistId, problemId}
        })
    )

    const problemsInPlaylist = await db.problemInPlaylist.createMany({
        data:problemIds.map((problemId)=>({
            playlistId,
            problemId   
        }))
    })

    return res.status(201).json(new ApiResponse(200, problemsInPlaylist, "Problems added to playlist successfully"));    

}

const deletePlaylist = async (req, res) => {
    const {playlistId} = req.params;

    const deletedPlaylist = await db.playlist.delete({
        where:{
            id:playlistId
        }
    })

    return res.status(201).json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")); 
}

const removeProblemFromPlayList = async(req, res) => {
    const {playlistId} = req.params;
    const {problemIds} = req.body; //accepting an array

    if(!Array.isArray(problemIds) || problemIds.length == 0){
        throw new ApiError(400, "Invalid or missing problem Ids");
    }

    const deletedproblems = await db.problemInPlaylist.deleteMany({
        where:{
            playlistId,
            problemId:{
                in: problemIds
            }
        }
    });

    return res.status(201).json(new ApiResponse(200, deletedproblems, "problems removed from playlist successfully")); 

}

export{
    createPlaylist,
    getAllListDetails,
    getPlayListDetails,
    deletePlaylist,
    removeProblemFromPlayList,
    addproblemToPlaylist
};