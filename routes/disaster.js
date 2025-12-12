import express from "express";
import Disaster from "../models/disaster.js";
import mongoose from "mongoose";

const router = express.Router();

/* ===================== GET ALL DISASTERS ===================== */
router.get("/", async (req, res) => {
    try {
        const disasters = await Disaster.find().sort({ createdAt: -1 });
        res.json(disasters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===================== GET DISASTER BY ID ===================== */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "ID tidak valid" });
        }

        const disaster = await Disaster.findById(id);
        if (!disaster) {
            return res.status(404).json({ error: "Data bencana tidak ditemukan" });
        }

        res.json(disaster);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===================== CREATE NEW DISASTER ===================== */
router.post("/", async (req, res) => {
    try {
        const { name, description, category, status, latitude, longitude } = req.body;

        // Validasi input dasar
        if (!name || !category) {
            return res.status(400).json({
                error: "Nama dan Kategori bencana wajib diisi",
            });
        }

        if (typeof latitude !== "number" || typeof longitude !== "number") {
            return res.status(400).json({
                error: "Latitude dan Longitude harus berupa angka",
            });
        }

        const newDisaster = new Disaster({
            name,
            description,
            category,
            status, // opsional, default 'Pasca Bencana'
            location: {
                type: "Point",
                coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
            },
        });

        const savedDisaster = await newDisaster.save();
        res.status(201).json(savedDisaster);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===================== UPDATE DISASTER ===================== */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, status, latitude, longitude } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "ID tidak valid" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (status) updateData.status = status;

        // Update lokasi jika latitude dan longitude diberikan
        if (typeof latitude === "number" && typeof longitude === "number") {
            updateData.location = {
                type: "Point",
                coordinates: [longitude, latitude],
            };
        }

        const updatedDisaster = await Disaster.findByIdAndUpdate(id, updateData, {
            new: true, // mengembalikan data yang sudah diupdate
            runValidators: true, // pastikan validasi schema berjalan
        });

        if (!updatedDisaster) {
            return res.status(404).json({ error: "Data bencana tidak ditemukan" });
        }

        res.json(updatedDisaster);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===================== DELETE DISASTER ===================== */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "ID tidak valid" });
        }

        const deletedDisaster = await Disaster.findByIdAndDelete(id);

        if (!deletedDisaster) {
            return res.status(404).json({ error: "Data bencana tidak ditemukan" });
        }

        res.json({
            message: "Data bencana berhasil dihapus",
            id: deletedDisaster._id,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
