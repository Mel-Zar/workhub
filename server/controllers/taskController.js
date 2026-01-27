// GET all tasks with search, filtering, sorting and pagination
exports.getTasks = async (req, res) => {
    try {
        const { search, priority, completed, sortBy, order, page, limit } = req.query;

        const query = {
            user: req.user.id
        };

        // 🔍 SEARCH
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // 🎯 FILTER PRIORITY
        if (priority) {
            query.priority = priority;
        }

        // ✅ FILTER COMPLETED
        if (completed !== undefined) {
            query.completed = completed === "true";
        }

        // 🔃 SORTING
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === "asc" ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        // 📄 PAGINATION
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 5;
        const skip = (pageNumber - 1) * limitNumber;

        const tasks = await Task.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);

        const total = await Task.countDocuments(query);

        res.json({
            page: pageNumber,
            limit: limitNumber,
            totalTasks: total,
            totalPages: Math.ceil(total / limitNumber),
            tasks
        });

    } catch (err) {
        console.error("Error getting tasks:", err);
        res.status(500).json({ error: "Server error" });
    }
};
