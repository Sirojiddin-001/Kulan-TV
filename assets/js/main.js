const select = new Select("#select", {
  placeholder: "Выберите категорию",
  data: [
    { id: "uz_сhannels", value: "Узбекские каналы" },
    { id: "ru_сhannels", value: "Русские каналы" },
  ],
  onSelect(item) {
    rend(item.id);
  },
});

let Player;

videojs("video").ready(function () {
  Player = this;
});

let firebaseConfig = {
  apiKey: "AIzaSyADIJWUOemKiCPbcce-rid0vA6E4PvwBBE",
  authDomain: "online-tv-001.firebaseapp.com",
  projectId: "online-tv-001",
  databaseURL: "https://online-tv-001-default-rtdb.firebaseio.com",
  storageBucket: "online-tv-001.appspot.com",
  messagingSenderId: "402306228956",
  appId: "1:402306228956:web:ea35cf7b9c58097d53ca19",
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();


const toggleBtn = document.getElementById("toggle");
const list = document.getElementById("list");

let show = true;
let chanell_name;

const _show = () => {
  toggleBtn.setAttribute("uk-icon", "icon:close; ratio: 1.5");
  document.getElementById("list").style = "display:flex !important";
  show = false;
};

const _hide = () => {
  toggleBtn.setAttribute("uk-icon", "icon:menu; ratio: 1.5");
  document.getElementById("list").style = "display:none !important";
  show = true;
};

toggleBtn.onclick = () => {
  show ? _show() : _hide();
};

window.onresize = () => {
  document.body.offsetWidth > 960 ? _show() : _hide();
};

const rend = (item = "uz_сhannels") => {
  document.getElementById("data-list").innerHTML = "";
  let query = firebase.database().ref(item).orderByKey();
  query.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      let key = childSnapshot.key;
      let title = childSnapshot.val().title;
      let element = document.createElement("li");
      element.innerHTML = title;
      element.className = "data-item";
      element.setAttribute("data-id", key);
      element.addEventListener("click", function () {
        document.querySelectorAll("#data-list li").forEach(function (el) {
          el.classList.remove("active");
        });
        this.classList.add("active");
        let id = this.dataset["id"];
        firebase
          .database()
          .ref(`${item}/${id}`)
          .on("value", (snapshot) => {
            Player.src({
              type: "application/x-mpegURL",
              src: snapshot.val()?.url,
            });
            Player.play();
            if (document.body.offsetWidth < 960) {
              _hide();
            }
          });
        document.getElementById("chanell_name").innerHTML = this.innerHTML;
          chanell_name = this.innerHTML;
      });
      document.getElementById("data-list").appendChild(element);
    });
  });
};

window.onload = async () => {
  rend();
  let t = setInterval(() => {
    if (document.getElementById("data-list").firstChild) {
      document.getElementById("data-list").firstChild.click();
      clearInterval(t);
    }
  }, 100);
  	if ("serviceWorker" in navigator) {
		  try {
		    await navigator.serviceWorker.register("./sw.js");
		    console.info("Service worker register Success");
		  } catch (e) {
		    console.error("Service worker register Error");
		  }
		}
};

navigator.mediaSession.metadata = new MediaMetadata({
  title: chanell_name,
  artwork: [
    { src: "./assets/img/cover.png", sizes: "96x96", type: "image/png" },
    { src: "./assets/img/cover.png", sizes: "128x128", type: "image/png" },
    { src: "./assets/img/cover.png", sizes: "192x192", type: "image/png" },
    { src: "./assets/img/cover.png", sizes: "256x256", type: "image/png" },
    { src: "./assets/img/cover.png", sizes: "384x384", type: "image/png" },
    { src: "./assets/img/cover.png", sizes: "512x512", type: "image/png" },
  ],
})