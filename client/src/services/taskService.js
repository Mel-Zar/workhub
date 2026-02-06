import { request } from "../api/http";

export const taskService = {

    // Hämta alla tasks
    getAll: (signal) => {
        return request("/api/tasks?limit=10000", { signal });
    },

    // Hämta en task via id
    getById: (id, signal) => {
        return request(`/api/tasks/${id}`, { signal });
    },

    // Skapa task
    create: (formData) => {
        return request("/api/tasks", {
            method: "POST",
            body: formData
        });
    },

    // Uppdatera task
    update: (id, body) => {
        return request(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    // Ta bort task
    remove: (id) => {
        return request(`/api/tasks/${id}`, {
            method: "DELETE"
        });
    }
};
