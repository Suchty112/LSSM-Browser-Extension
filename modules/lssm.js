let markup='<li id="lssm" title="LSS-Manager V.4"><a><span class="label label-success">LSS-Manager</span></a></li>';
document.querySelector(".nav.navbar-nav.navbar-right").innerHTML+=markup;

let sync = function() {
    let game = "lss";
    if (window.location.href.match(/missionchief/)) {
        game = "mc"
    } else if (window.location.href.match(/meldkamerspel/)) {
        game = "mk"
    } else if (window.location.href.match(/leitstellenspiel/)) {
        game = "lss"
    }

    const lssmAppId = "dfdaagjfgemogdpmendepmnoenaomhfp";

    if (typeof user_id !== "undefined") {

        let vars = {};

        vars[game] = {
            user_id: user_id,
            username: username,
            map_type: typeof mapkit !== "undefined" ? "mapkit" : "OSM"
        };

        chrome.runtime.sendMessage(lssmAppId, vars);

    }
};

let script = document.createElement('script');
script.textContent = '(' + sync + ')()';
(document.head).appendChild(script);
script.parentNode.removeChild(script);
