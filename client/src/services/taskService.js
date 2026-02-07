import { request } from "../api/request";

export const taskService = {

    // ================= GET ALL TASKS =================
    getAll(params = {}, signal) {
        const query = new URLSearchParams(params).toString();
        const url = query
            ? `/api/tasks?${query}`
            : "/api/tasks";

        return request(url, { signal });
    },

    // ================= GET TASK BY ID =================
    getById(id, signal) {
        return request(`/api/tasks/${id}`, { signal });
    },

    // ================= CREATE TASK =================
    create(formData) {
        return request("/api/tasks", {
            method: "POST",
            body: formData
        });
    },

    // ================= UPDATE TASK =================
    update(id, body) {
        return request(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    // ================= DELETE TASK =================
    remove(id) {
        return request(`/api/tasks/${id}`, {
            method: "DELETE"
        });
    },

    // ================= ADD IMAGES =================
    addImages(id, formData) {
        return request(`/api/tasks/${id}/images`, {
            method: "POST",
            body: formData
        });
    },

    // ================= REMOVE IMAGE =================
    removeImage(id, image) {
        return request(`/api/tasks/${id}/images`, {
            method: "DELETE",
            body: JSON.stringify({ image })
        });
    }
};
