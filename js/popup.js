$.getJSON(chrome.runtime.getURL('_locales/' + new URLSearchParams(window.location.search).get('game') + "/messages.json"), function (trans) {

    let lang = new URLSearchParams(window.location.search).get('game');

    let game = lang === "nl" ? "mk" : lang === "en" ? "mc" : "lss";

    function t(key) {
        return trans[key] ? trans[key].message : "missing `" + key + "`";
    }

    $('a.link').click(function () {
        chrome.tabs.create({
            'url': $(this).attr('link')
        });
    });

    $('*[i18n]').each(function () {
        $(this).html(t($(this).attr('i18n')));
    });

    $('#lssm_appstore .row').append('<div class="col-sm-4 appstore-row"></div><div class="col-sm-4 appstore-row"></div><div class="col-sm-4 appstore-row"></div>');

    let mods = chrome.runtime.getManifest().content_scripts;

    mods.sort(function (a, b) {
        return t(a.name) > t(b.name);
    });

    let col = 0;
    let modules = {};
    modules[game + "_modules"] = {};
    $(mods).each(function () {
        let mod = this;
        chrome.storage.sync.get(game + "_modules"[mod.id], function (result) {
            if (typeof result.active === "undefined") {
                modules[game + "_modules"][mod.id] = {
                    active: mod.active
                };
            } else {
                modules[game + "_modules"][mod.id] = result;
            }
        });
    });
    // TODO: irgendwie das modules richtig speichern lassen
    chrome.storage.sync.set(modules, function(){});
    $(mods).each(function () {
        let mod = this;
        chrome.storage.sync.get(game + "_modules"[mod.id], function (result) {
            let markup = '<div style="margin-top:10px;" class="lssm_module' + (mod.develop ? ' lssm_module_develop' : '') + '"><div class="panel panel-default" style="display: inline-block;width:100%;"><div class="panel-body"><span class="pull-right"><div class="onoffswitch"><input class="onoffswitch-checkbox" id="lssm.modules_' + mod.id + '" ' + (result.active ? 'checked="true"' : '') + ' value="' + mod.id + '" name="onoffswitch" type="checkbox"><label class="onoffswitch-label" for="lssm.modules_' + mod.id + '"></label></div></span><h4>' + t(mod.name) + '</h4><small style="display:none">' + t(mod.description) + '</small></div></div></div>';
            $($('.appstore-row')[col]).append(markup);
            col += 1;
            if (col === 3) {
                col = 0;
            }
        });
    });
})
;
