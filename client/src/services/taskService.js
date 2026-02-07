import { apiFetch } from "../api/apiFetch";

export const taskService = {

    // ================= GET ALL TASKS =================
    getAll(params = {}, signal) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `/api/tasks?${query}` : "/api/tasks";
        return apiFetch(url, { method: "GET", signal }).then(res => res.json());
    },

    // ================= GET TASK BY ID =================
    getById(id, signal) {
        return apiFetch(`/api/tasks/${id}`, { method: "GET", signal }).then(res => res.json());
    },

    // ================= CREATE TASK =================
    create(formData) {
        // ⚠️ FormData → låt browser sätta Content-Type
        return apiFetch("/api/tasks", {
            method: "POST",
            body: formData,
            headers: {} // ta bort JSON Content-Type
        }).then(res => res.json());
    },

    // ================= UPDATE TASK =================
    update(id, body) {
        return apiFetch(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json());
    },

    // ================= DELETE TASK =================
    remove(id) {
        return apiFetch(`/api/tasks/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json());
    },

    // ================= ADD IMAGES =================
    addImages(id, formData) {
        return apiFetch(`/api/tasks/${id}/images`, {
            method: "POST",
            body: formData,
            headers: {} // FormData
        }).then(res => res.json());
    },

    // ================= REMOVE IMAGE =================
    removeImage(id, image) {
        return apiFetch(`/api/tasks/${id}/images`, {
            method: "DELETE",
            body: JSON.stringify({ image }),
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json());
    },

    // ================= TOGGLE COMPLETE =================
    toggleComplete(id, completed) {
        // skickar PUT med ny completed-status
        return apiFetch(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({ completed }),
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json());
    }
};
