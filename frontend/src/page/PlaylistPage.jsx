// src/page/PlaylistPage.jsx
import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../store/usePlayliststore";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import AddToPlaylistModal from "../components/AddToPlaylist";
import { Trash2, Plus, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PlaylistPage = () => {
  const {
    playlists,
    currentPlaylist,
    isLoading,
    getAllPlaylists,
    getPlaylistDetails,
    createPlaylist,
    addProblemToPlaylist,
    removeProblemFromPlaylist,
    deletePlaylist,
  } = usePlaylistStore();

  // Local UI state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [preselectPlaylistForAdd, setPreselectPlaylistForAdd] = useState(null);

  // load playlists on mount
  useEffect(() => {
    getAllPlaylists();
  }, []);

  // helper: open playlist details
  const openDetails = async (playlistId) => {
    setSelectedPlaylistId(playlistId);
    await getPlaylistDetails(playlistId);
    // currentPlaylist will be populated by store
  };

  // handler passed into CreatePlaylistModal
  const handleCreatePlaylist = async (payload) => {
    await createPlaylist(payload);
    setIsCreateOpen(false);
    // refresh list (store function already appends but ensure freshness)
    await getAllPlaylists();
  };

  // open AddToPlaylist modal and optionally preselect a playlist
  const handleOpenAddModal = (problemId, playlistId = null) => {
    setSelectedProblemId(problemId || "");
    setPreselectPlaylistForAdd(playlistId);
    setIsAddModalOpen(true);
  };

  // delete playlist
  const handleDeletePlaylist = async (id) => {
    if (!confirm("Delete this playlist? This action cannot be undone.")) return;
    await deletePlaylist(id);
    await getAllPlaylists();
    // if we deleted the currently opened detail, close it
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
    }
  };

  // remove a problem from the currently shown playlist
  const handleRemoveProblem = async (problemId) => {
    if (!selectedPlaylistId) return;
    await removeProblemFromPlaylist(selectedPlaylistId, [problemId]);
    await getPlaylistDetails(selectedPlaylistId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Playlists</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Organize problems into collections for focused practice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="btn btn-primary gap-2"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create Playlist
            </button>
          </div>
        </div>

        {/* Quick add area */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1 w-full">
              <label className="label">
                <span className="label-text">Add problem to a playlist</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Paste problem id (e.g. abcd1234)"
                  className="input input-bordered w-full"
                  value={selectedProblemId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                />
                <button
                  className="btn btn-outline"
                  onClick={() => handleOpenAddModal(selectedProblemId)}
                  disabled={!selectedProblemId}
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-base-content/60 mt-2">
                You can also add from a problem page using the "Save to Playlist" button.
              </p>
            </div>

            <div className="w-full md:w-auto flex gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setSelectedProblemId("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Playlists grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlists?.length ? (
            playlists.map((pl) => (
              <div
                key={pl.id}
                className="card bg-base-100 hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{pl.name}</h3>
                      {pl.description && (
                        <p className="text-sm text-base-content/70 mt-1">
                          {pl.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-sm text-base-content/60">
                        <span>{pl.problems?.length ?? 0} problems</span>
                        <span className="opacity-40">•</span>
                        <span>Created {new Date(pl.createdAt ?? pl.CreatedAt ?? Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => openDetails(pl.id)}
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </button>

                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleOpenAddModal("", pl.id)}
                          title="Add problem to this playlist"
                        >
                          Add
                        </button>

                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDeletePlaylist(pl.id)}
                          title="Delete playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <small className="text-xs text-base-content/60">
                        Owner: you
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1">
              <div className="card bg-base-100 p-8 text-center">
                <h3 className="text-lg font-semibold">No playlists yet</h3>
                <p className="text-base-content/70 mt-2">Create your first playlist to start organizing problems.</p>
                <div className="mt-4">
                  <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Create Playlist
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Playlist details panel */}
        {currentPlaylist && selectedPlaylistId === currentPlaylist.id && (
          <div className="card bg-base-100 shadow-lg mt-6">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{currentPlaylist.name}</h2>
                  <p className="text-sm text-base-content/70">{currentPlaylist.description}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPlaylistId(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                {currentPlaylist.problems?.length ? (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Problem ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPlaylist.problems.map((p) => (
                          <tr key={p.problemId ?? p.id}>
                            <td className="font-medium">{p.problem?.title ?? p.title ?? "Untitled"}</td>
                            <td className="font-mono text-sm">{p.problemId ?? p.id}</td>
                            <td>
                              <div className="flex gap-2">
                                <Link to={`/problem/${p.problemId ?? p.id}`} className="btn btn-xs btn-outline">Open</Link>
                                <button
                                  className="btn btn-xs btn-error"
                                  onClick={() => handleRemoveProblem(p.problemId ?? p.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-base-content/70">No problems in this playlist yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals — reuse existing components */}
        <CreatePlaylistModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreatePlaylist}
        />

        <AddToPlaylistModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedProblemId("");
            setPreselectPlaylistForAdd(null);
          }}
          problemId={selectedProblemId}
          // NOTE: this modal currently may not accept preselect prop.
          // If AddToPlaylistModal supports a preselectPlaylistId prop, pass it like:
          // preselectPlaylistId={preselectPlaylistForAdd}
        />
      </div>
    </div>
  );
};

export default PlaylistPage;
