"use strict";
let map;
onload = function(){
    const userLanguage = (
        (window.navigator.languages && window.navigator.languages[0])
        || window.navigator.language
        || window.navigator.userLanguage
        || window.navigator.browserLanguage
    ).toLowerCase().split("-")[0];

    const stateURL = new URL(location.href);
    const params = stateURL.searchParams;

    const ship = document.querySelector("#ship");
    const shipType = document.querySelector("#shipType");
    const shipDataArea = document.querySelector("#shipDataArea");

    const changeElentSize=(()=>{
        const remainingHeight = window.innerHeight - document.querySelector("#header").clientHeight;
        document.querySelector("#shipWrapper").style.height=remainingHeight+"px";
        document.querySelector("#map").style.height=remainingHeight+"px";
    });
    window.onresize = changeElentSize;

    let rotation = Number(params.get("rotation")) || 0;
    let shipWidth=0;

    map = (()=>{
        let lat = Number(params.get("lat")) || 35.71;
        let lng = Number(params.get("lng")) || 139.76;
        if(!(lat>=-90 && lat <=90)) lat = 35.71;

        let zoom = Math.floor(Number(params.get("zoom"))) || 15;
        zoom = (zoom<1) ? 1 : zoom;
        zoom = (zoom>18) ? 18 : zoom;

        return L.map("map", {
            center: [lat,lng],
            zoom: zoom,
        });
    })();

    const gsi = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {attribution:"Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"}
    );
    const osm = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution:"<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors" });
        
    const baseMaps = userLanguage=="ja" ?{
        "航空写真" : gsi,
        "地図"  : osm
    }:{
        "Satellite" : gsi,
        "Map"  : osm
    };
    L.control.layers(baseMaps).addTo(map);
    L.control.scale().addTo(map);
    L.control.locate().addTo(map);
    gsi.addTo(map);

    map.on("zoomend", () => {
        warpScale();
    });
    map.on("moveend", () => {
        const {lat,lng} = map.getCenter();
        params.set("lat",lat);
        params.set("lng",lng);
        history.replaceState('',document.title,stateURL.href);
    });

    function warpScale() {
        const zoom = map.getZoom();
        const metersPerPx =
            (156543.03392 * Math.cos((map.getCenter().lat * Math.PI) / 180)) /
            Math.pow(2, zoom);
        const scale = 1 / metersPerPx;
        console.log("warpScale");
        
        ship.style.width=`${shipWidth*scale}px`;
        //ship.style.transform = `translate(-50%,-50%) rotate(${rotation}rad) scale(${scale})`;
        ship.style.transform = `translate(-50%,-50%) rotate(${rotation}rad)`;

        //const shipWidth = parseFloat(ship.style.width);
        ship.style.filter=`drop-shadow(black`
            +` ${shipWidth*scale*0.1*(Math.cos(rotation)+Math.sin(rotation))}px`
            +` ${shipWidth*scale*0.1*(Math.cos(rotation)-Math.sin(rotation))}px`
            +` ${shipWidth*scale*0.05}px)`;
        
        params.set("rotation",rotation);
        params.set("zoom",zoom);
        history.replaceState('',document.title,stateURL.href);
    }
    warpScale();

    const ships = {};
    shipDatas.forEach(category=>{
        const categoryName = userLanguage=="ja" ? category.categoryJa : category.category;
        //console.log(categoryName);
        const optgroup = document.createElement("optgroup");
        optgroup.label = categoryName;
        shipType.appendChild(optgroup);
        category.ships.forEach(ship=>{
            const shipName = userLanguage=="ja" ? ship.shipTypeJa: ship.shipType;
            const option = document.createElement("option");
            option.value = ship.id;
            option.innerHTML = shipName;
            optgroup.appendChild(option);
            //console.log(shipName);
            ships[ship.id]=ship;
        })
    });


    shipType.addEventListener("change",function(e){
        viewShip(shipType.value);
    });

    
    shipType.value=viewShip(params.get("ship") || "");

    document.querySelector("#rotateRight").addEventListener("click",function(e){
        e.preventDefault();
        rotation += Math.PI / 18;
        rotation = rotation % (2*Math.PI);
        warpScale();
    })
    document.querySelector("#rotateLeft").addEventListener("click",function(e){
        e.preventDefault();
        rotation -= Math.PI / 18;
        rotation = rotation % (2*Math.PI);
        warpScale();
    })

    //document.querySelector("#resetPos").innerHTML = userLanguage=="ja" ? "初期位置" : "Reset Position";

    const sharingDialog=new SharingDiaglog(userLanguage);
    document.querySelector("#openSharingDialog span").innerHTML = userLanguage=="ja" ? "共有" : "Share";
    document.querySelector("#openSharingDialog").addEventListener("click",(e)=>{
        e.preventDefault();
        sharingDialog.open();
    })


    document.querySelector("#rotateLeft").appendChild(document.createTextNode(userLanguage=="ja" ? "回転" : "Rotate the Ship"));
    document.querySelector("#transparentLabel").appendChild(document.createTextNode(userLanguage=="ja" ? "半透明" : "Transparent"));
    document.querySelector("#transparent").addEventListener("change",function(e){
        if(this.checked){
            ship.style.opacity=0.5;
        }else{
            ship.style.opacity=1;
        }
    })

    changeElentSize();

    function viewShip(shipType){
        shipType=shipType.toLowerCase();

        if(!ships[shipType]) shipType = "isd";

        //ship.style.backgroundImage=`url(./ship/${shipType}.png)`;
        ship.src=``;
        ship.src=`./shipImage/${shipType}.png`;

        shipWidth = ships[shipType].width;
        warpScale();
        //ship.style.width=`${shipWidth}px`;
        //ship.style.filter=`drop-shadow(black ${shipDatas[shipType].shadowX}px ${shipDatas[shipType].shadowY}px ${shipDatas[shipType].shadowBlur}px)`;
        
        ship.style.filter=`drop-shadow(black`
            +` ${shipWidth*0.1*(Math.cos(rotation)+Math.sin(rotation))}px`
            +` ${shipWidth*0.1*(Math.cos(rotation)-Math.sin(rotation))}px`
            +` ${shipWidth*0.05}px)`;
        
        const imgSource = ships[shipType].imgSource;
        shipDataArea.innerHTML = `<span>${(
            userLanguage=="ja"
            ?ships[shipType].size.replace("Length","全長").replace("Width","全幅").replace("Wingspan","全幅")
            :ships[shipType].size
        )}</span>`;
        document.querySelector("#shipImageCredit").innerHTML = (imgSource?` <small>${imgSource}</small>`:"");
        params.set("ship",shipType);
        history.replaceState('',document.title,stateURL.href);

        return shipType;
    }
}

class SharingDiaglog{
    constructor(userLanguage){
        //document.querySelector("#dialog-wrapper").style.display="flex";
        this.sharingDialog = document.querySelector("#sharing-dialog");
        this.includeCoordinate = this.sharingDialog.querySelector("#includeCoordinate");
        this.sharingURL = location.href.split("?")[0];
        if(userLanguage=="ja"){
            this.sharingDialog.querySelector(".dialog-title").innerHTML="共有";
            this.includeCoordinate.nextElementSibling.innerHTML="座標情報を含める";
        }
        this.includeCoordinate.addEventListener("change",(e)=>{
            if(e.target.checked){
                this.sharingURL = location.href;
            }else{
                this.sharingURL = location.href.split("?")[0];
            }
        });
        this.sharingDialog.querySelector(".dialog-close").addEventListener("click",(e)=>{
            e.preventDefault();
            this.close();
        })
        this.sharingDialog.addEventListener("click",(e)=>{
            e.stopPropagation();
        })
        document.querySelector("#dialog-wrapper").addEventListener("click",(e)=>{
            this.close();
        })
        document.querySelector("#sharing-url a").addEventListener("click",(e)=>{
            const range = document.createRange();
            range.selectNode(document.querySelector("#sharing-url span"));
            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
        })
    }
    get sharingURL(){
        return this._sharingURL;
    }
    set sharingURL(sharingURL){
        this._sharingURL=sharingURL;
        this.sharingDialog.querySelector(".line-share").href=`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(sharingURL)}`;
        this.sharingDialog.querySelector(".twitter-share").href
            =`https://twitter.com/intent/tweet?text=${encodeURIComponent("#DestroyerEverywhere\n"+sharingURL)}`;
        this.sharingDialog.querySelector("#sharing-url span").innerHTML = sharingURL;
    }
    open(){
        document.querySelector("#dialog-wrapper").style.display="flex"; 
        this.sharingURL = location.href.split("?")[0];
        this.includeCoordinate.checked=false;
    }
    close(){
        document.querySelector("#dialog-wrapper").style.display="none"; 
    }
}

const shipDatas = [
    {
        category:"Destroyers",
        categoryJa:"デストロイヤー",
        ships:[
            {
                id:"isd",
                shipType:"Imperial-class Star Destroyer",
                shipTypeJa:"インペリアル級スター・デストロイヤー",
                imgSource:`Image from <a target="_blank" href="https://bandai-hobby.net/item/3152/">bandai-hobby.net</a>`,
                size:"Length:1600.0m",
                width:1600,
            },
            {
                id:"ssd",
                shipType:"Executor-class Star Dreadnought",
                shipTypeJa:"エグゼクター級スター・ドレッドノート",
                imgSource:`Image from <a target="_blank" href="https://www.starwars.com/">starwars.com</a>`,
                //http://starwars.com/explore/encyclopedia/technology/superstardestroyer/
                size:"Length:19000.0m",
                width:19000,
            },
            {
                id:"vsd",
                shipType:"Venator-class Star Destroyer",
                shipTypeJa:"ヴェネター級スター・デストロイヤー",
                imgSource:`Image from <a target="_blank" href="https://www.fantasyflightgames.com/en/products/star-wars-armada/">Star Wars: Armada</a>`,
                //https://store.us.asmodee.com/catalogue/sw-armada-venator-class-star-destroyer_3369/
                size:"Length:1155.0m",
                width:1155,
            },
            {
                id:"acclamator",
                shipType:"Acclamator-class assault ship",
                shipTypeJa:"アクラメーター級アサルト・シップ",
                imgSource:`Image from <i>the Clone Wars</i> Blu-ray`,
                size:"Length:752m",
                width:752,
            },
            {
                id:"xsd",
                shipType:"(Xyston-class Star Destroyer)",
                shipTypeJa:"(ジストン級スター・デストロイヤー)",
                imgSource:``,
                size:"Length:2406m",
                width:2406,
            },
            {
                id:"rsd",
                shipType:"(Resurgent-class Star Destroyer)",
                shipTypeJa:"(リサージェント級スター・デストロイヤー)",
                imgSource:``,
                size:"Length:2915.81m",
                width:2915.81,
            },
            {
                id:"msd",
                shipType:"Mega-class Star Dreadnought",
                shipTypeJa:"メガ級スター・ドレッドノート",
                imgSource:`<a href="https://3dwarehouse.sketchup.com/model/9e57a3b4-c738-407a-8093-fae6a54ad9a0/THE-OMINOUSMEGA-CLASS-STAR-DESTROYER-THE-SUPREMACY-SKETCHYFAEZ-EDITION">Image</a> by <a target="_blank" href="https://3dwarehouse.sketchup.com/user/2a062875-63da-4daf-bc75-8c0b55f0c987/SketchyFaez">SketchyFaez</a>`,
                size:"Width:60km",
                width:60*1000,
            },
        ]
    },
    {
        category:"Separatists Battleship",
        categoryJa:"分離主義者の戦艦",
        ships:[
            {
                id:"lucrehulk",
                shipType:"Lucrehulk-class Battleship",
                shipTypeJa:"ルクレハルク級バトルシップ",
                imgSource:`Image from <i>the Clone Wars</i> Blu-ray`,
                size:"Width:3009m",
                width:3009,
            },
            {
                id:"c-9979",
                shipType:"C-9979 landing craft",
                shipTypeJa:"C-9979上陸艇",
                imgSource:`Image from <i>the Clone Wars</i> Blu-ray`,
                size:"Wingspan:149.0m",
                width:149,
            },
            {
                id:"malevolence",
                shipType:"Malevolence",
                shipTypeJa:"マレヴォランス",
                imgSource:`Image from <a target="_blank" href="https://www.starwars.com/">starwars.com</a>`,
                //http://starwars.com/explore/encyclopedia/technology/malevolence/
                size:"Length:4845m",
                width:4845,
            },
            {
                id:"providence",
                shipType:"Providence-class Dreadnought",
                shipTypeJa:"プロヴィデンス級ドレッドノート",
                imgSource:`Image from <a target="_blank" href="https://www.starwars.com/">starwars.com</a>`,
                //http://starwars.com/explore/encyclopedia/technology/separatistdreadnaught/
                size:"Length:2177.35m",
                width:2177.35,
            },
            {
                id:"munificent",
                shipType:"Munificent-class star frigate",
                shipTypeJa:"ミューニフィセント級スター・フリゲート",
                imgSource:`Image from <a target="_blank" href="https://www.fantasyflightgames.com/en/products/star-wars-armada/">Star Wars: Armada</a>`,
                size:"Length:825m",
                width:825,
            },
        ],
    },
    {
        category:"others",
        categoryJa:"その他",
        ships:[
            {
                id:"blockaderunner",
                shipType:"Blockade Runner",
                shipTypeJa:"ブロッケード・ランナー",
                imgSource:`Image from <a target="_blank" href="https://bandai-hobby.net/item/2914/">bandai-hobby.net</a>`,
                size:"Length:150m",
                width:162,
            },
            {
                id:"yt1300",
                shipType:"Millenium Falcon",
                shipTypeJa:"ミレニアム・ファルコン",
                imgSource:`Image from <a target="_blank" href="https://bandai-hobby.net/item/3485/">bandai-hobby.net</a>`,
                size:"Length:34.52m",
                width:34.52,
            },
            {
                id:"slave1",
                shipType:"Slave I",
                shipTypeJa:"スレーブI",
                imgSource:`Image from <a target="_blank" href="https://bandai-hobby.net/item/1958/">bandai-hobby.net</a>`,
                size:"Length:21.5m",
                width:21.5,
            },
            {
                id:"stealthship",
                shipType:"Stealth Ship",
                shipTypeJa:"ステルス・シップ",
                imgSource:`Image from <a target="_blank" href="https://www.starwars.com/">starwars.com</a>`,
                size:"Length:99.71m",
                width:102,
            },
            {
                id:"pelta",
                shipType:"Pelta-class frigate",
                shipTypeJa:"ペルタ級フリゲート",
                imgSource:`Image from <a target="_blank" href="https://www.fantasyflightgames.com/en/products/star-wars-armada/">Star Wars: Armada</a>`,
                size:"Length:282m",
                width:282,
            },
            {
                id:"tie_sk",
                shipType:"TIE striker",
                shipTypeJa:"TIEストライカー",
                imgSource:`Image from <a target="_blank" href="https://bandai-hobby.net/item/1734/">bandai-hobby.net</a>`,
                size:"Length:17.18m",
                width:17.18,
            },
            {
                id:"atat",
                shipType:"AT-AT",
                shipTypeJa:"AT-AT",
                imgSource:`Image from <a target="_blank" href="https://bandai-hobby.net/item/1764/">bandai-hobby.net</a>`,
                size:"Length:20m",
                width:20,
            },
        ],
    }
    /*
    "hyena":{
        imgSource:"http://www.starwars.com/explore/encyclopedia/technology/hyenabombers/",
        size:"12.48 meters long",
        width:12.8,
    },
    "delta7b":{
        imgSource:"http://www.starwars.com/explore/encyclopedia/technology/jedistarfighter/",
        size:"8 meters long",
        width:8,
    },
    */
];