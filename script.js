const rem = 16;

class Bubble{
  constructor(image, text, answer){
    this.image = image;
    this.text = text;
    this.answer = answer;

    this.active = false;

    this.radius = 7;

    this.speed = (Math.random() * 2) + 1;

    this.x = Math.floor(Math.random() * window.innerWidth) - (this.radius * rem);
    if(this.x < 0) this.x = 0;
    this.y = window.innerHeight;


    this.colors = ['blueviolet', 'cornflowerblue', 'cyan', 'alicbBlue', 'azure', 'blanchedalmond', 'lightgreen', 'lightseagreen', 'lightpink', 'lightskyblue', 'palegreen', 'mediumpurple', 'mediumslateblue', 'powderblue', 'plum', 'lightyellow', 'linen'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  checkAnswer(answer){
    return answer == this.answer;
  }

  expand(){
    if(!this.active && !data.active && data.running){
      console.log('expanding');
      this.active = true;
      data.active = true;
    }
  }

  close(){
    setTimeout(function(){
      console.log('closing');
      data.active = false;
      this.active = false;
      this.radius = 0;
    }, 10)
  }
}

Vue.component('bubble', {
  props: ['x', 'y', 'r', 'c', 'cb', 'b', 'i', 'running'],
  methods: {
    styleString(){
      return`
        top: ${this.$props.y}px;
        left: ${this.$props.x}px;
        width: ${this.$props.r}rem;
        height: ${this.$props.r}rem;
        background-color: ${this.$props.c};
      `;
    },

    answer(answer){
      console.log(answer, this.$props.b.answer);
      if(answer == this.$props.b.answer){
        const bubble = data.bubbles[this.$props.i];
        data.bubblesPopped++;
        // const bubble = this.$props.b;
        setTimeout(function(){
          bubble.active = false;
          data.active = false;
          bubble.radius = 0;
        }, 10);
      }
    }
  },
  template: `
<div
  :style="styleString()"
  @click="b.expand()"
  :class="{'bubble-active': b.active, 'bubble': true, 'column': true, 'bubble-running': running}"
>
  <div v-if="b.active" class="column">
    <span>{{b.text}}</span>
    <img class="bubble-image" v-if="b.image != ''" :src="b.image" />
    <div class="row">
      <md-button class="md-icon-button md-raised" @click="answer('V')">V</md-button>
      <md-button class="md-icon-button md-raised" @click="answer('D')">D</md-button>
      <md-button class="md-icon-button md-raised" @click="answer('B')">B</md-button>
    </div>
  </div>
</div>
  `
});

const data = {
  bubbles: [],
  speed: 3,
  time: 0,
  spawnRate: 25,
  active: false,
  running: false,
  difficulty: 'easy',
  difficulties: ['easy', 'medium', 'hard'],
  timeLeft: 60,
  done: false,
  bubblesPopped: 0,
}

const methods = {
  startGame(){
    data.spawnRate = 10000000;
    data.speed = 100;
    data.running = true;

    setTimeout(function(){
      if(data.difficulty == 'easy'){
        data.speed = .5;
        data.spawnRate = 130;
      }
      else if(data.difficulty == 'medium'){
        data.speed = .9;
        data.spawnRate = 100;
      }
      else if(data.difficulty == 'hard'){
        data.speed = 1.3;
        data.spawnRate = 80;
      }
    }, 1000);
  }
}

Vue.use(VueMaterial.default);

const app = new Vue({
  el: "#app",
  data: data,
  methods: methods,
});


setInterval(function(){
  const remove = [];
  data.bubbles.forEach((bubble, index) => {
    if(!bubble.active)bubble.y -= bubble.speed * data.speed;

    if(bubble.y < 0 - bubble.radius * 2 * rem){
      remove.push(index);
      bubble.speed = 0;
    }
  });

  remove.forEach(index => {
    data.bubbles.splice(index, 1);
  });

  if(data.time % data.spawnRate == 0){
    const q = questionData[Math.floor(Math.random() * questionData.length)];
    data.bubbles.push(new Bubble(q.image, q.text, q.answer));
  }

  data.time++;
}, 20);

setInterval(function(){
  if(data.running){
    data.timeLeft--;
  }
  if(data.timeLeft == 0){
    data.running = false;
    data.done = true;
  }
}, 1000);
