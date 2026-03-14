const cake = document.getElementById('cake');
const candlesLayer = document.getElementById('candles-layer');

const candleColors = ['#5e35b1', '#f44336', '#4caf50', '#ff9800', '#2196f3', '#ffeb3b'];

let candleCount = 0;
let isModalShown = false;


// Tạo nến khi click bánh
cake.addEventListener('click', (e) => {

    const rect = cake.getBoundingClientRect();

    const x = e.clientX - rect.left - 6;
    const y = e.clientY - rect.top - 25;

    const candle = document.createElement('div');
    candle.className = 'candle';

    candle.style.left = `${x}px`;
    candle.style.top = `${y}px`;

    candle.style.backgroundColor =
        candleColors[candleCount % candleColors.length];

    candleCount++;

    const flame = document.createElement('div');
    flame.className = 'flame';

    candle.appendChild(flame);
    candlesLayer.appendChild(candle);
});


// kiểm tra tất cả nến đã tắt
function checkAllCandlesOff(){

    const total = document.querySelectorAll('.candle').length;

    const off = document.querySelectorAll('.flame[style*="display: none"]').length;

    if(total > 0 && total === off && !isModalShown){

        isModalShown = true;

        showModal();
    }
}



// setup micro thổi nến
async function setupMic(){

    try{

        const stream = await navigator.mediaDevices.getUserMedia({audio:true});

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const analyser = audioContext.createAnalyser();

        const microphone = audioContext.createMediaStreamSource(stream);

        microphone.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);


        function checkBlow(){

            analyser.getByteFrequencyData(dataArray);

            let sum = 0;

            for(let i=0;i<bufferLength;i++){
                sum += dataArray[i];
            }

            const average = sum / bufferLength;

            // nếu âm thanh lớn -> tắt nến
            if(average > 40){

                document.querySelectorAll('.flame').forEach(f=>{
                    f.style.display = 'none';
                });

                checkAllCandlesOff();
            }

            requestAnimationFrame(checkBlow);
        }

        checkBlow();

    }catch(err){

        console.log("Cần cho phép micro để thổi nến!");

    }

}



// mở modal
function showModal(){

    document.getElementById('overlay').style.display='block';

    const modal = document.getElementById('wish-modal');

    modal.classList.add('active');

    const typing = document.getElementById("typing-text");

    typing.innerHTML = "";

    typeWriter("🎂 Chúc mừng sinh nhật ANNEE nhé ! Chúc em một tuổi mới , luôn vui vẻ , mạnh khỏe và hạnh phúc 🎉",0);

}



// hiệu ứng gõ chữ
function typeWriter(text,i){

    if(i < text.length){

        document.getElementById("typing-text").innerHTML += text.charAt(i);

        setTimeout(()=>{

            typeWriter(text,i+1);

        },80);

    }

}



// đóng modal
function closeModal(){

    document.getElementById('overlay').style.display='none';

    document.getElementById('wish-modal').classList.remove('active');

}



setupMic();