import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getOneProject();
  }, [id]);

  async function getOneProject() {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`http://localhost:3000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);

      setProject(data);
      reset({
        name: data.name,
        description: data.description,
      });
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProjectHandle(value) {
    const token = localStorage.getItem("token");

    const { data, status } = await axios.patch(
      `http://localhost:3000/projects/${id}`,
      value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (status === 200) {
      setProject(data);

      reset({
        name: data.name,
        description: data.description,
      });

      setIsEditing(false);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />

          <p className="mt-4 text-slate-400">Loading project...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="rounded-2xl border border-slate-800 bg-[#0c1228] p-10 text-center">
          <p className="text-4xl">📁</p>

          <h2 className="mt-4 text-xl font-bold">Project not found</h2>

          <p className="mt-2 text-slate-400">
            This project does not exist or you do not have access.
          </p>
        </div>
      </main>
    );
  }

  const owner = typeof project.owner === "object" ? project.owner : null;

  const members = Array.isArray(project.members) ? project.members : [];

  const ownerName = owner
    ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim()
    : "Project owner";

  return (
    <main className="min-w-0 flex-1 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Project Header */}
        <section className="rounded-3xl border border-slate-800 bg-[#0c1228] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-600/20 text-3xl">
                📁
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold">{project.name}</h1>

                  <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-300">
                    Active Project
                  </span>
                </div>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  {project.description || "No project description"}
                </p>
              </div>
            </div>

            {/* Actions - Design only */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500 hover:text-violet-300"
              >
                Edit Project
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Project Information */}
          <div className="mt-8 grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-[#11172a] p-5">
              <p className="text-sm text-slate-500">Project Owner</p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold uppercase">
                  {owner?.firstName?.charAt(0) || "O"}
                </div>

                <div>
                  <p className="font-semibold">{ownerName}</p>

                  <p className="text-xs text-slate-500">
                    {owner?.email || "Owner"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#11172a] p-5">
              <p className="text-sm text-slate-500">Team Members</p>

              <p className="mt-3 text-3xl font-bold">{members.length}</p>

              <p className="mt-1 text-xs text-slate-500">
                Members with project access
              </p>
            </div>

            <div className="rounded-2xl bg-[#11172a] p-5">
              <p className="text-sm text-slate-500">Created At</p>

              <p className="mt-3 font-semibold">
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Project creation date
              </p>
            </div>
          </div>
        </section>

        {isEditing && (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-[#0c1228] p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-bold">Edit Project</h2>

              <p className="mt-2 text-sm text-slate-400">
                Update the project name or description.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(updateProjectHandle)}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="editName"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Project name
                </label>

                <input
                  id="editName"
                  type="text"
                  {...register("name")}
                  className="w-full rounded-xl border border-slate-700 bg-[#11172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="editDescription"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="editDescription"
                  rows="5"
                  {...register("description")}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-[#11172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset({
                      name: project.name,
                      description: project.description,
                    });

                    setIsEditing(false);
                  }}
                  className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Members Section */}
        <section className="mt-8 rounded-3xl border border-slate-800 bg-[#0c1228] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Project Members</h2>

              <p className="mt-1 text-sm text-slate-400">
                People who can access and work on this project.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              + Add Member
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => {
              const memberObject = typeof member === "object" ? member : null;

              const memberId = memberObject?._id || member;

              const memberName = memberObject
                ? `${memberObject.firstName || ""} ${
                    memberObject.lastName || ""
                  }`.trim()
                : "Project member";

              return (
                <div
                  key={memberId}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#11172a] p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600/20 font-bold uppercase text-violet-300">
                      {memberObject?.firstName?.charAt(0) || "M"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold">{memberName}</p>

                      <p className="truncate text-sm text-slate-500">
                        {memberObject?.email || "Project member"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                    Member
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tasks Placeholder */}
        <section className="mt-8 rounded-3xl border border-slate-800 bg-[#0c1228] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Project Tasks</h2>

              <p className="mt-1 text-sm text-slate-400">
                Tasks belonging to this project will appear here.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
            >
              + Create Task
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-4xl">✅</p>

            <p className="mt-4 font-semibold">Tasks section</p>

            <p className="mt-2 text-sm text-slate-500">
              We will connect it after finishing the project functions.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
