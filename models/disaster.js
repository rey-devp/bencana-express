import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Nama bencana wajib diisi"],
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            required: [true, "Kategori bencana wajib diisi"], // e.g., 'Banjir', 'Gempa', 'Tsunami'
        },
        status: {
            type: String,
            enum: ["Waspada", "Siaga", "Awas", "Pasca Bencana"],
            default: "Pasca Bencana",
        },
        date: {
            type: Date,
            default: Date.now,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: [true, "Koordinat lokasi wajib diisi"],
            },
        },
    },
    {
        collection: "location",
        timestamps: true,
    }
);

// Index 2dsphere untuk query geospasial (misal: cari bencana terdekat)
disasterSchema.index({ location: "2dsphere" });

export default mongoose.model("Disaster", disasterSchema);
