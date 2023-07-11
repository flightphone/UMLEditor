let texts = [`@startuml
    !include C4_Container.puml
    
    LAYOUT_TOP_DOWN()
    LAYOUT_WITH_LEGEND()
    
    title Container diagram for Internet Banking System
    
    Person(customer, Customer, "A customer of the bank, with personal bank accounts")
    
    System_Boundary(c1, "Internet Banking") {
        Container(web_app, "Web Application", "Java, Spring MVC", "Delivers the static content and the Internet banking SPA")
        Container(spa, "Single-Page App", "JavaScript, Angular", "Provides all the Internet banking functionality to cutomers via their web browser")
        Container(mobile_app, "Mobile App", "C#, Xamarin", "Provides a limited subset of the Internet banking functionality to customers via their mobile device")
        ContainerDb(database, "Database", "SQL Database", "Stores user registraion information, hased auth credentials, access logs, etc.")
        Container(backend_api, "API Application", "Java, Docker Container", "Provides Internet banking functionality via API")
    }
    
    System_Ext(email_system, "E-Mail System", "The internal Microsoft Exchange system")
    System_Ext(banking_system, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")
    
    Rel(customer, web_app, "Uses", "HTTPS")
    Rel(customer, spa, "Uses", "HTTPS")
    Rel(customer, mobile_app, "Uses")
    
    Rel_Neighbor(web_app, spa, "Delivers")
    Rel(spa, backend_api, "Uses", "async, JSON/HTTPS")
    Rel(mobile_app, backend_api, "Uses", "async, JSON/HTTPS")
    Rel_Back_Neighbor(database, backend_api, "Reads from and writes to", "sync, JDBC")
    
    Rel_Back(customer, email_system, "Sends e-mails to")
    Rel_Back(email_system, backend_api, "Sends e-mails using", "sync, SMTP")
    Rel_Neighbor(backend_api, banking_system, "Uses", "sync/async, XML/HTTPS")
    @enduml
    `,
    `[Pirate|eyeCount: Int|raid();pillage()|
    [beard]--[parrot]
    [beard]-:>[foul mouth]
  ]
  
  [<abstract>Marauder]<:--[Pirate]
  [Pirate]- 0..7[mischief]
  [jollyness]->[Pirate]
  [jollyness]->[rum]
  [jollyness]->[singing]
  [Pirate]-> *[rum|tastiness: Int|swig()]
  [Pirate]->[singing]
  [singing]<->[rum]
  
  [<start>st]->[<state>plunder]
  [plunder]->[<choice>more loot]
  [more loot]->[st]
  [more loot] no ->[<end>e]
  
  [<actor>Sailor] - [<usecase>shiver me;timbers]`,
    `skinparam ranksep 20
skinparam dpi 125
skinparam packageTitleAlignment left

rectangle "Main" {
  (main.view)
  (singleton)
}
rectangle "Base" {
  (base.component)
  (component)
  (model)
}
rectangle "<b>main.ts</b>" as main_ts

(component) ..> (base.component)
main_ts ==> (main.view)
(main.view) --> (component)
(main.view) ...> (singleton)
(singleton) ---> (model)`,
    `@startmindmap
skinparam monochrome true
+ OS
++ Ubuntu
+++ Linux Mint
+++ Kubuntu
+++ Lubuntu
+++ KDE Neon
++ LMDE
++ SolydXK
++ SteamOS
++ Raspbian
-- Windows 95
-- Windows 98
-- Windows NT
--- Windows 8
--- Windows 10
@endmindmap`,
    `@startuml

skin rose

skinparam componentStyle uml2

title Packages - Component Diagram

package "Front End" {
    component [Graphic User Interface] as GUI
}

cloud Internet {
}
 
node "Middle Tier" {
    [Business Logic]
    [Data Access] as DA  
    interface IMath as Math
    note left of Math : This is a web Service Interface
    note right of Math : Notice the label below
    interface "IItems" as Items
    
    note left of [Business Logic]
        A note can also
        be on several lines
        like this one
    end note
    
} 

database "PostgreSQL" {
    [Stored Procs]
}

GUI -down-> Internet
Internet -down-( Math
[Business Logic] -up- Math : Web Services
DA -up- Items  : .Net
[Business Logic] --( Items
DA .. [Stored Procs]

@enduml
`,
`@startuml

skin rose

title Relationships - Class Diagram


class Dwelling {
  +Int Windows
  +void LockTheDoor()
}

class Apartment
class House
class Commune
class Window
class Door

Dwelling <|-down- Apartment: Inheritance
Dwelling <|-down- Commune: Inheritance
Dwelling <|-down- House: Inheritance
Dwelling "1" *-up- "many" Window: Composition
Dwelling "1" *-up- "many" Door: Composition

@enduml`,
`@startuml

skin rose

title Conditional - Activity Diagram 


start

:Eat Hot Wings; 
note right: This is a note to the right

:Drink Homebrew; 
note left: This is a note to the left

if (Turn On The Game?) then (yes)
  :__Having Fun__!!!;
else (no)
  :Not Having Fun;
endif

:Go To Bed;

stop

@enduml`
];

let urls = ["https://kroki.io/c4plantuml/svg", "https://kroki.io/nomnoml/svg", "https://kroki.io/plantuml/svg", "https://kroki.io/plantuml/svg", "https://kroki.io/plantuml/svg", "https://kroki.io/plantuml/svg", "https://kroki.io/plantuml/svg"];
//let url = "https://kroki.io/plantuml/svg";  
//let url = "https://kroki.io/nomnoml/svg";  
//let url = "https://kroki.io/structurizr/svg";  


let butTest = async (t, u) => {

    let response = await fetch(u, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: t
    });

    let result = await response.text();
    let i = result.indexOf("<svg");
    result = result.substring(i);
    result = result.replace(/<!--SRC=(.*?)-->/i, "")
    return result;
};

let loaddi = async () => {
    let result = "";
    for (let i = 0; i < texts.length; i++) {
        let text = texts[i];
        let url = urls[i];
        let a = await butTest(text, url);
        result = `${result}
<div>
${a}
</div>`
    }
    document.getElementById("ta").value = result;
}

loaddi();



let parseD = (d, dx, dy) => {
    let num = "-0123456789"
    a = d.split(" ");
    let ad = a.map((val) => {
        if (val == "")
            return "";

        let pref = "";
        if (!num.includes(val[0])) {
            pref = val[0];
            val = val.substr(1);
        }
        let xy = val.split(",")
        let x = parseFloat(xy[0]) + dx;
        let y = parseFloat(xy[1]) + dy;
        let res = `${pref}${x},${y}`;
        return res;
    })
    let nd = ad.join(" ");
    return nd;
}


moveElement = (id, dx, dy) => {
    let el = document.getElementById(id);
    for (let i = 0; i < el.childNodes.length; i++) {
        let che = el.childNodes[i];
        if (che.tagName == "ellipse") {
            let x = che.cx.baseVal.value + dx;
            let y = che.cy.baseVal.value + dy;
            che.setAttribute("cx", x);
            che.setAttribute("cy", y);
        }
        if (che.tagName == "line") {
            let x1 = che.x1.baseVal.value + dx;
            let y1 = che.y1.baseVal.value + dy;
            let x2 = che.x2.baseVal.value + dx;
            let y2 = che.y2.baseVal.value + dy;
            che.setAttribute("x1", x1);
            che.setAttribute("y1", y1);
            che.setAttribute("x2", x2);
            che.setAttribute("y2", y2);
        }
        if (che.tagName == "text") {
            let x = che.x.baseVal[0].value + dx;
            let y = che.y.baseVal[0].value + dy;
            che.setAttribute("x", x);
            che.setAttribute("y", y);
        }

        if (che.tagName == "rect") {
            let x = che.x.baseVal.value + dx;
            let y = che.y.baseVal.value + dy;
            che.setAttribute("x", x);
            che.setAttribute("y", y);
        }

        if (che.tagName == "polygon") {
            for (let i = 0; i < che.points.length; i++) {
                let a = che.points[i];
                //console.log(`${a.x}, ${a.y}`);
                a.x += dx;
                a.y += dy;
            }
        }
        if (che.tagName == "path") {
            let d = che.getAttribute("d");
            d = parseD(d, dx, dy);
            che.setAttribute("d", d);
        }
    }

}



function DrawSсheme() {
    // this.id = id;
    // let lsvg = document.getElementById(id);
    //console.log("start");
    this.mSVG = document.getElementsByTagName("svg")[0];
    this.isDrawing = false;

    window.addEventListener("mouseup", (e) => {
        if (this.isDrawing) {
            this.x = 0;
            this.y = 0;
            this.isDrawing = false;
        }
    });

    this.mSVG.addEventListener("mousedown", (e) => {
        //console.log("mouse");
        this.x = this.scale(e.offsetX);
        this.y = this.scale(e.offsetY);
        let id = e.target.id;
        if (!id)
            id = e.target.dataset.name;
        if (!id)
            id = e.target.parentElement.id;
        if (!id)
            id = e.target.parentElement.dataset.name;
        // if (id) {
        //     this.active = id;
        //     this.isDrawing = true;
        // }
        // console.log(id);
        if (id)
            alert(id);
    });

    this.scale = (x) => {
        //return ((x * this.w) / this.mSVG.width.baseVal.value);
        return (x);
    }

    this.mSVG.addEventListener("mousemove", (e) => {
        if (this.isDrawing) {
            moveElement(this.active, this.scale(e.offsetX) - this.x, this.scale(e.offsetY) - this.y);
            this.x = this.scale(e.offsetX);
            this.y = this.scale(e.offsetY);
        }
    });
}