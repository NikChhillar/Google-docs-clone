import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import Connection from "./db/db.js";
import { getDocument, updateDocument } from "./controller/docController.js";

const PORT = process.env.PORT;
console.log("Port -", PORT);

//
Connection();

//
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//
io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const docData = await getDocument(documentId);

    socket.join(documentId);

    socket.emit("load-document", docData.data);

    socket.on("send-changes", (delta) => {
      console.log(delta);
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});
