import { apiFetch } from "../api/apiFetch";

export const taskService = {
    getAll(params = {}, signal) {
        const query = new URLSearchParams(params).toString();
        return apiFetch(
            `/api/tasks${query ? "?" + query : ""}`,
            { signal }
        );
    },

    getById(id) {
        return apiFetch(`/api/tasks/${id}`);
    },

    create(formData) {
        return apiFetch("/api/tasks", {
            method: "POST",
            body: formData
        });
    },

    update(id, body) {
        return apiFetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    },

    remove(id) {
        return apiFetch(`/api/tasks/${id}`, {
            method: "DELETE"
        });
    },

    addImages(id, formData) {
        return apiFetch(`/api/tasks/${id}/images`, {
            method: "POST",
            body: formData
        });
    },

    removeImage(id, imagePath) {
        return apiFetch(
            `/api/tasks/${id}/images?image=${encodeURIComponent(imagePath)}`,
            { method: "DELETE" }
        );
    },

    reorderImages(id, images) {
        return apiFetch(`/api/tasks/${id}/reorder-images`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ images })
        });
    },

    toggleComplete(id) {
        return apiFetch(`/api/tasks/${id}/toggle`, {
            method: "PATCH"
        });
    }
};
