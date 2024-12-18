"use strict";
const user_lang = ((
    (window.navigator.languages && window.navigator.languages[0])
    || window.navigator.language
    || window.navigator.userLanguage
    || window.navigator.browserLanguage
).toLowerCase().split("-")[0])=="ja"?"ja":"en";

class Episode{
    constructor({type,title,note}){
        this.type=type;
        this.title=title;
        this.note=note;
    }
    get html(){
        const type_multiLang = (()=>{
            switch(this.type){
                case "comic":
                return {en:"comic",ja:"コミック"};

                case "live-action":
                return {en:"live-action",ja:"ドラマ"};

                case "animated-series":
                return {en:"animated-series",ja:"アニメ"};

                case "game":
                return {en:"game",ja:"ゲーム"};

                case "novel":
                return {en:"novel",ja:"小説"};

                default:
                return plain_text(this.type || "");
            }
        })();
        return `<cite>${plain_text(this.title)}</cite>` + (this.note?" "+plain_text(this.note):"");
        //return `${plain_text(type_multiLang)} <cite>${plain_text(this.title)}</cite>` + (this.note?" "+plain_text(this.note):"");
    }
}

class Inquisitor{
    constructor({name,img,img_src,img_w,img_pos,lightsaber_img,species,died,appearances,note}){
        this.name = name;
        this.img=img;
        this.img_w = img_w
        this.img_pos=img_pos;
        this.lightsaber_img=lightsaber_img;
        this.species=species;
        this.died=died;
        this.appearances=appearances;
        this.note = note;
        this.img_src = img_src;
    }
    get DOM(){
        let img_css = `width:${this.img_w}px;`;
        ["top","left","right","bottom"].forEach(pos=>{
            if(this.img_pos[pos]) img_css += ` ${pos}:${this.img_pos[pos]}px;`;
        })
        if(this.img_pos["z-index"]) img_css += ` z-index:${this.img_pos["z-index"]};`;
        const img_html = (this.img=="?")?"?":(this.img?`<img src="./img/${this.img}" style="${img_css}">`:"");

        this.tr = document.createElement("tr");
        this.tr.innerHTML = `
        <td class="inq_name">${plain_text(this.name)+(this.note?("<div>"+plain_text(this.note)+"</div>"):"")}</td>
        <td class="inq_img">${img_html}</td>
        <td class="inq_saber">${this.lightsaber_img?'<img src="./img/'+this.lightsaber_img+'">':""}</td>
        <td class="inq_species">${plain_text(this.species)}</td>
        <td></td>
        <td class="inq_died"><span class="spoiler">${plain_text(this.died)}</span></td>
        <td class="inq_appearances">
            <ul>
                ${this.appearances.map(episode=>("<li>"+episode.html+"</li>")).join("")}
            </ul>
        </td>
        `
        return this.tr;
    }

    set margin(margin){
        if(!this.tr) return;
        this.tr.style["margin-left"]=margin+"px";
    }
    get margin(){
        if(!this.tr) return undefined;
        return this.tr.style["margin-left"];
    }
}

function plain_text(multilang_text){
    if(!multilang_text) return "";
    return (multilang_text[user_lang]
        || multilang_text["en"]
        || multilang_text);//.replace(/ /g,`&nbsp;`);
}

const numbered_inquisitors = [
    new Inquisitor({
        name:{en:"The Grand Inquisitor",ja:"大尋問官"},
        img:"1st.png",
        img_src:"https://advancedgraphics.com/grand-inquisitor-lifesize-cardboard-cutout-standee-3924/",
        img_w:125,
        img_pos:{top:10,left:-25},
        lightsaber_img:"1st_l.png",
        species:{en:"Pau'an",ja:"パウアン"},
        died:{
            en:"4 BBY, Sovereign, Mustafar system",
            ja:"4BBY、ムスタファー星系内の<ソヴリン>"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017)",ja:"スター・ウォーズ:シスの暗黒卿"}
            }),
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Tales of the Empire",ja:"スター・ウォーズ テイルズ・オブ・エンパイア"}
            }),
            new Episode({
                type:"live-action",
                title:{en:"Star Wars: Obi-Wan Kenobi",ja:"スター・ウォーズ オビ=ワン・ケノービ"}
            }),
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Rebels",ja:"スター・ウォーズ 反乱者たち"}
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`<div class="spoiler">1st Brother</div><div>Marrok</div>`,ja:`<div class="spoiler">1st Brother</div><div>マロック</div>`},
        img:"Marrok.png",
        img_w:220,
        img_pos:{bottom:0},
        lightsaber_img:"Marrok_l.png",
        species:"?",
        died:{ en:"9 ABY, Seatos",ja:"9ABY、シートス"},
        appearances:[
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Tales of the Empire",ja:"スター・ウォーズ テイルズ・オブ・エンパイア"}
            }),
            new Episode({
                type:"live-action",
                title:{en:`Ahsoka`, ja:`アソーカ`},
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`2nd Sister<div class="spoiler">(Trilla Suduri)</div>`,ja:`2nd Sister<div class="spoiler">(トリラ・スドゥリ)</div>`},
        img:"2nd.png",
        img_w:120,
        img_pos:{top:25,left:-10},
        lightsaber_img:"2nd_l.png",
        species:{en:"Human",ja:"人間"},
        died:{
            en:"14 BBY, Fortress Inquisitorius, Nur",
            ja:"14BBY、ナーの尋問官の要塞"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017) Vol.4 — Fortress Vader",ja:"スター・ウォーズ:シスの暗黒卿 ベイダーの城"}
            }),
            new Episode({
                type:"game",
                title:{en:"Star Wars Jedi: Fallen Order",ja:"Star Wars ジェダイ:フォールン・オーダー"}
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`3rd Sister<div>Reva Sevander</div>`,ja:`3rd Sister<div>リーヴァ・サヴェンダー</div>`},
        img:"3rd.png",
        img_src:"https://advancedgraphics.com/reva-third-sister-lifesize-cardboard-cutout-standee-3927/",
        img_w:85,
        img_pos:{top:20,left:10},
        lightsaber_img:"3rd_l.png",
        species:{en:"Human",ja:"人間"},
        died:"",
        appearances:[
            new Episode({
                type:"live-action",
                title:{en:"Star Wars: Obi-Wan Kenobi",ja:"スター・ウォーズ オビ=ワン・ケノービ"}
            }),
        ]
    }),
    new Inquisitor({
        name:`3rd Brother?`,
        img:"?",
        img_w:undefined,
        img_pos:{},
        lightsaber_img:"",
        species:"?",
        died:"",
        appearances:[]
    }),
    new Inquisitor({
        name:`4th Sister<div>Lyn</div>`,
        img:"4th.png",
        img_w:150,
        img_pos:{top:15,left:-50},
        lightsaber_img:"4th_l.png",
        species:"?",
        died:undefined,
        appearances:[
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Tales of the Empire",ja:"スター・ウォーズ テイルズ・オブ・エンパイア"}
            }),
            new Episode({
                type:"live-action",
                title:{en:"Star Wars: Obi-Wan Kenobi",ja:"スター・ウォーズ オビ=ワン・ケノービ"}
            }),
        ]
    }),
    new Inquisitor({
        name:`5th Brother`,
        img:"5th.png",
        img_src:"https://advancedgraphics.com/fith-brother-lifesize-cardboard-cutout-standee-3928/",
        img_w:100,
        img_pos:{top:5},
        lightsaber_img:"5th_l.png",
        species:"?",
        died:{
            en:"3 BBY, Malachor",
            ja:"3BBY、マラコア"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017)",ja:"スター・ウォーズ:シスの暗黒卿"}
            }),
            new Episode({
                type:"live-action",
                title:{en:"Star Wars: Obi-Wan Kenobi",ja:"スター・ウォーズ オビ=ワン・ケノービ"}
            }),
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Rebels",ja:"スター・ウォーズ 反乱者たち"}
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`6th Brother<div class="spoiler">(Bil Valen)</div>`,ja:`6th Brother<div class="spoiler">(ビル・ヴァレン)</div>`},
        img:"6th.png",
        img_w:80,
        img_pos:{},
        lightsaber_img:"6th_l.png",
        species:"?",
        died:{
            en:"18 BBY, Raada",
            ja:"18BBY、Raada"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017)",ja:"スター・ウォーズ:シスの暗黒卿"}
            }),
            new Episode({
                type:"novel",
                title:{en:"Star Wars: Ahsoka",ja:"アソーカ"}
            }),
        ]
    }),
    new Inquisitor({
        name:`7th Sister`,
        img:"7th.png",
        img_w:120,
        img_pos:{bottom:-20,left:-20},
        lightsaber_img:"7th_l.png",
        species:{en:"Mirialan",ja:"ミリアラン"},
        died:{
            en:"3 BBY, Malachor",
            ja:"3BBY、マラコア"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017)",ja:"スター・ウォーズ:シスの暗黒卿"}
            }),
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Rebels",ja:"スター・ウォーズ 反乱者たち"}
            }),
        ]
    }),
    new Inquisitor({
        name:`8th Brother`,
        img:"8th.png",
        img_w:80,
        img_pos:{bottom:-10,left:-10},
        lightsaber_img:"8th_l.png",
        species:{en:"Terrelian Jango Jumper",ja:"テラリアン・ジャンゴ・ジャンパー"},
        died:{
            en:"3 BBY, Malachor",
            ja:"3BBY、マラコア"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017)",ja:"スター・ウォーズ:シスの暗黒卿"}
            }),
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Rebels",ja:"スター・ウォーズ 反乱者たち"}
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`9th Sister<div class="spoiler">(Masana Tide)</div>`,ja:`9th Sister<div class="spoiler">(マサナ・タイド)</div>`},
        img:"js_9th.png",
        img_w:200,
        img_pos:{bottom:-10,right:-40,"z-index":2000},
        lightsaber_img:"9th_l2.png",
        species:{en:"Dowutin",ja:"ドウーティン"},
        died:{
            en:"9 BBY, Coruscant",
            ja:"9BY、コルサント"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017)",ja:"スター・ウォーズ:シスの暗黒卿"}
            }),
            new Episode({
                type:"game",
                title:{en:"Star Wars Jedi: Fallen Order",ja:"Star Wars ジェダイ:フォールン・オーダー"}
            }),
            new Episode({
                type:"game",
                title:{en:"Star Wars Jedi: Survivor",ja:"STAR WARS ジェダイ:サバイバー"}
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`10th Brother<div class="spoiler">(Prosset Dibs)</div>`,ja:`10th Brother<div class="spoiler">(プロセット・ディブス)</div>`},
        img:"10th.png",
        img_w:95,
        img_pos:{bottom:22,right:-15},
        lightsaber_img:"10th_l.png",
        species:{en:"Miraluka",ja:"ミラルカ"},
        died:{
            en:"18 BBY, Mon Cala",
            ja:"18BBY、モン・カラ"
        },
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017) Vol.3 — The Burning Seas",ja:"スター・ウォーズ:シスの暗黒卿 燃える海原"}
            }),
        ]
    }),
    new Inquisitor({
        name:`11th Brother`,
        img:"ahsoka_inq.png",
        img_w:120,
        img_pos:{},
        species:`?`,
        died:{en:"Imperial era",ja:"帝国時代"},
        appearances:[
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Tales of the Empire",ja:"スター・ウォーズ テイルズ・オブ・エンパイア"}
            }),
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Tales of the Jedi",ja:"スター・ウォーズ：テイルズ・オブ・ジェダイ"}
            }),
        ]
    }),
    new Inquisitor({
        name:`<div class="spoiler">13th Sister</div><span class="spoiler">(</span>Iskat Akaris<span class="spoiler">)</span>`,
        img:"uf.png",
        img_w:85,
        img_pos:{bottom:35,right:0,"z-index":20000},
        lightsaber_img:"uf_l.png",
        species:`<div class="fakes">?</div><div class="spoiler">Pkorian<div>`,
        died:{en:"Coruscant, before 14 BBY",ja:"コルサント、14BBY以前"},
        appearances:[
            new Episode({
                type:"novel",
                title:`Inquisitor: Rise of the Red Blade`
            }),
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017) Vol.4 — Fortress Vader",ja:"スター・ウォーズ:シスの暗黒卿 ベイダーの城"}
            }),
        ]
    }),
    new Inquisitor({
        name:`Tualon Yaluna`,
        img:"Tualon.png",
        img_w:180,
        img_pos:{bottom:0,left:-50,"z-index":10000},
        lightsaber_img:"ut_l.png",
        species:{en:"Twi'lek",ja:"トワイレック"},
        died:{en:"Coruscant, before 14 BBY",ja:"コルサント、14BBY以前"},
        appearances:[
            new Episode({
                type:"novel",
                title:`Inquisitor: Rise of the Red Blade`
            }),
            new Episode({
                type:"comic",
                title:{en:"Star Wars: Darth Vader (2017) Vol.4 — Fortress Vader",ja:"スター・ウォーズ:シスの暗黒卿 ベイダーの城"}
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`Barriss Offee`,ja:`バリス・オフィー`},
        img:"barriss.png",
        img_src:"https://www.youtube.com/watch?v=8SIST9t72kY",
        img_w:130,
        img_pos:{top:30, left:-20},
        species:{en:"Mirialan",ja:"ミリアラン"},
        died:"",
        appearances:[
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Tales of the Empire",ja:"スター・ウォーズ テイルズ・オブ・エンパイア"}
            }),
        ]
    }),
];
const unidentified_inquisitors = [
    new Inquisitor({
        name:{en:`(Jerserra's master)`,ja:`(Jerserraの師匠)`},
        img:"?",
        img_w:undefined,
        img_pos:{},
        lightsaber_img:"Jerserra_l.png",
        species:`?`,
        died:{en:"Dathomir, Imperial era",ja:"ダソミア、帝国時代"},
        appearances:[
            new Episode({
                type:"FFG adventure book",
                title:"Ghosts of Dathomir",
                note:{en:` (Mentioned only)`,ja:`（言及のみ）`},
            }),
        ]
    }),
    new Inquisitor({
        name:`?`,
        img:"?",
        img_w:undefined,
        img_pos:{},
        lightsaber_img:"",
        species:`?`,
        died:undefined,
        appearances:[
            new Episode({
                type:"mobile game",
                title:"Star Wars: Uprising",
                note:{en:" (Mentioned only)",ja:"（言及のみ）"},
            }),
        ]
    }),
];
const noncanon_inquisitors = [
    new Inquisitor({
        name:`?`,
        note:{en:`(Non-canon)`,ja:"(ノンカノン)"},
        img:"T0-B1_Inquisitor.png",
        img_w:280,
        img_pos:{bottom:20,left:-130},
        lightsaber_img:"",
        species:`?`,
        died:{en:`Imperial Era, T0-B1's home planet`,ja:`帝国時代、T0-B1の惑星`},
        appearances:[
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Visions T0-B1",ja:"スター・ウォーズ:ビジョンズ T0-B1"},
            }),
        ]
    }),new Inquisitor({
        name:`?`,
        note:{en:`(Non-canon)`,ja:"(ノンカノン)"},
        img:"visions_s2_inq2.png",
        img_w:110,
        img_pos:{bottom:0,left:0},
        lightsaber_img:"visions2_l.png",
        species:`?`,
        died:{en:`Imperial Era, Golak`,ja:`帝国時代、ゴラク`},
        appearances:[
            new Episode({
                type:"animated-series",
                title:{en:"Star Wars: Visions The Bandits of Golak",ja:"スター・ウォーズ:ビジョンズ ゴラクの盗賊"},
            }),
        ]
    }),
]
const non_inquisitors = [
    new Inquisitor({
        name:`M-OC`,
        note:{en:`(Hunter droid)`,ja:"(ハンター・ドロイド)"},
        img:"M-OC.png",
        img_w:180,
        img_pos:{bottom:30,left:-40},
        lightsaber_img:"M-OC_l.png",
        species:{en:`Hunter droid`,ja:"ハンター・ドロイド"},
        died:{en:`4 ABY, Death Star II (Non-canon)`,ja:`4ABY、デス・スターII（ノンカノン）`},
        appearances:[
            new Episode({
                type:"book",
                title:{en:"Droidography",},
            }),
            new Episode({
                type:"",
                title:{en:"LEGO Star Wars: The Freemaker Adventures", ja:"LEGO スター・ウォーズ/フリーメーカーの冒険",},
            }),
        ]
    }),
    new Inquisitor({
        name:{en:`Naare`,ja:`ナアレ`},
        note:{en:`(Agent/Non-canon)`,ja:"(エージェント/ノンカノン)"},
        img:"Naare.png",
        img_w:150,
        img_pos:{bottom:30,left:-10},
        lightsaber_img:"",
        species:"?",
        died:undefined,
        appearances:[
            new Episode({
                type:"",
                title:{en:"LEGO Star Wars: The Freemaker Adventures", ja:"LEGO スター・ウォーズ/フリーメーカーの冒険",},
            }),
        ]
    }),
    new Inquisitor({
        name:{
            en:`<span class="fakes">4th Sister ?</span><span class="spoiler">Lina Graf</span><div class="spoiler">(Impersonated)</div>`,
            ja:`<span class="fakes">4th Sister ?</span><span class="spoiler">Lina Graf</span><div class="spoiler">(変装)</div>`,
        },
        img:"LinaGraf.png",
        img_w:95,
        img_pos:{top:10,left:5},
        lightsaber_img:"",
        species:"?",
        died:undefined,
        appearances:[
            new Episode({
                type:"comic",
                title:{en:"Star Wars Adventures: Return to Vader's Castle",ja:""},
            }),
        ]
    }),
];

window.addEventListener("load",()=>{
    let spoilerFlag=false;//0ならネタバレ非表示
    document.querySelectorAll(".spoilerSwitch").forEach(switchLink=>{
        switchLink.addEventListener("click",(e)=>{
            e.preventDefault();
    
            if(!spoilerFlag){
                document.querySelectorAll(".spoiler").forEach(el=>{
                    if(el.tagName=="DIV"){
                        el.style.display="block";
                    }else{
                        el.style.display="inline";
                    }
                });
                document.querySelectorAll(".fakes").forEach(el=>el.style.display="none");
                spoilerFlag=true;
                //document.querySelector("#spoilerSwitch").innerHTML ="しない";
            }else{
                document.querySelectorAll(".spoiler").forEach(el=>el.style.display="none");
                document.querySelectorAll(".fakes").forEach(el=>{
                    if(el.tagName=="DIV"){
                        el.style.display="block";
                    }else{
                        el.style.display="inline";
                    }
                });
                spoilerFlag=false;
                //document.querySelector("#spoilerSwitch").innerHTML ="する";
            }
        });
    });

    const inquisitor_tbody = document.querySelector("table#inquisitors tbody")
    numbered_inquisitors.forEach(inquisitor=>{
        inquisitor_tbody.append(inquisitor.DOM);
    });
    unidentified_inquisitors.forEach((inquisitor,i)=>{
        inquisitor_tbody.append(inquisitor.DOM);
        if(i==0) inquisitor.margin=5;
    });
    noncanon_inquisitors.forEach((inquisitor,i)=>{
        inquisitor_tbody.append(inquisitor.DOM);
        if(i==0) inquisitor.margin=5;
    });
    non_inquisitors.forEach((inquisitor,i)=>{
        inquisitor_tbody.append(inquisitor.DOM);
        if(i==0) inquisitor.margin=150;
    });

    if(user_lang!="en"){
        document.querySelectorAll(`[lang=en]`).forEach(el=>el.style.display="none");
        document.querySelectorAll(`[lang=${user_lang}]`).forEach(el=>el.style.display="initial");
    }
});
