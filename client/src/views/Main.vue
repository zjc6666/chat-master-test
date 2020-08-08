<template>
<!--  <div class="container mt-5">
    <h1 class="float-left">Home</h1>
    <div class="float-right d-flex align-items-center">
      <div class="mr-3">Hello: {{ user ? user.email : '' }}</div>
      <button class="btn btn-danger" @click="logout">Logout</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in listUsers" :key="user._id">
          <th scope="row">{{ user._id }}</th>
          <td>{{ user.displayName }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div> -->
  <chat-window :currentUserId="currentUserId" :rooms="rooms" :messages="messages" />
</template>
<script>
  import ChatWindow from 'vue-advanced-chat'
  import 'vue-advanced-chat/dist/vue-advanced-chat.css'

  export default {
    components: {
      ChatWindow
    },
    data() {
      return {
        // rooms: [],
        rooms:[{
            roomId: 1,
            roomName: 'Room 1',
            lastMessage: {
              content: 'Last message received',
              sender_id: 1234,
              username: 'John Doe',
              timestamp: '10:20',
              date: 123242424,
              seen: false,
              new: true
            },
    users: [
      {
        _id: 1234,
        username: 'John Doe',
        status: {
          state: 'online',
          last_changed: 'today, 14:30'
        }
      },
      {
        _id: 4321,
        username: 'John Snow',
        status: {
          state: 'offline',
          last_changed: '14 July, 20:00'
        }
      }
    ],
    typingUsers: [ 4321 ]
  }
],
        
        messages: [],
        currentUserId: 1234
      }
    }
  }
</script>

<!--
<script>
import axios from "axios";
import io from "socket.io-client";

export default {
  data() {
    return {
      user: null,
      listUsers: [],
      socket: null,
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        const token = localStorage.getItem("jwt");

        const response = await axios.get(
          process.env.VUE_APP_BASE_URL + "/user",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        this.user = response.data;
        this.initSocket();
      } catch (error) {
        console.log(error);
        this.$router.push("/Login");
      }
    },
    initSocket() {
      const socket = io(process.env.VUE_APP_BASE_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      });

      socket.on("connect", () => {
        console.log("connected");
        socket.emit("get list users");
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });

      socket.on("list users", (data) => {
        this.listUsers = data.listUsers;

        socket.emit("join room", { user: this.user });
        const index = this.listUsers.findIndex(
          (user) => user._id === this.user._id
        );
        if (index === -1) {
          this.listUsers.push(this.user);
        }
      });

      socket.on("an user joined room", (data) => {
        const index = this.listUsers.findIndex(
          (user) => user._id === data.user._id
        );
        if (index === -1) {
          this.listUsers.push(data.user);
        }
      });

      socket.on("an user leaved room", (data) => {
        const index = this.listUsers.findIndex(
          (user) => user._id === data.user._id
        );
        if (index > -1) {
          this.listUsers.splice(index, 1);
        }
      });

      this.socket = socket;
    },
    logout() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
      this.socket.disconnect();
    },
  },
};
</script>
-->
