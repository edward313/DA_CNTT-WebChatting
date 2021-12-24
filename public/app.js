
const socket = io();

const msgText= document.querySelector('#msg')
const btnSend= document.querySelector('#btn-send')
const chatBox= document.querySelector('.chat-content')
const displayMsg= document.querySelector('.message')

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveRoom =document.getElementById('leave-btn')
// let name;
// do{
//     name=prompt('what is your name')
// }while(!name)

// Lấy tên và phòng từ url

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const username = urlParams.get('username')

const room = urlParams.get('room')


 
socket.emit('joinRoom', { username, room });



document.querySelector('#your-name').textContent = username
msgText.focus()



socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
    console.log(room)
  });
btnSend.addEventListener('click',(e)=>{
    e.preventDefault()
    sendMsg(msgText.value)
    
    msgText.value= '';
    msgText.focus()
    chatBox.scrollTop = chatBox.scrollHeight
})

const sendMsg = message =>{
    let msg={
        user : username,
        message : message.trim()
    }
    
    display(msg,'you-message')
    socket.emit('sendMessage',msg)
    
}

socket.on('sendtoAll',msg=>{
    display(msg,'other-message')
    chatBox.scrollTop = chatBox.scrollHeight
})

const display = (msg, type) =>{
    const msgDiv = document.createElement('div')
    let className = type
    msgDiv.classList.add(className, 'message-row')
    let time = new Date().toLocaleTimeString();
    let interText = `
    <div class="message-title">
        <span>${msg.user}</span>
    </div>
        <div class="message-text">
            ${msg.message}
        </div>
      <div class="message-time">
            ${time}
    </div>
    `;
    msgDiv.innerHTML=interText;
    displayMsg.appendChild(msgDiv)
    chatBox.scrollTop = chatBox.scrollHeight
}


function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  

  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });