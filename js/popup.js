$.getJSON(chrome.runtime.getURL('_locales/' + new URLSearchParams(window.location.search).get('game') + "/messages.json"), function(trans) {

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
    $(mods).each(function () {
        let markup = '<div style="margin-top:10px;" class="lssm_module' + (this.develop ? ' lssm_module_develop' : '') + '"><div class="panel panel-default" style="display: inline-block;width:100%;"><div class="panel-body"><span class="pull-right"><div class="onoffswitch"><input class="onoffswitch-checkbox" id="lssm.modules_' + this.id + '" ' + (this.active ? 'checked="true"' : '') + ' value="' + this.id + '" name="onoffswitch" type="checkbox"><label class="onoffswitch-label" for="lssm.modules_' + this.id + '"></label></div></span><h4>' + t(this.name) + '</h4><small style="display:none">' + t(this.description) + '</small></div></div></div>';
        $($('.appstore-row')[col]).append(markup);
        col += 1;
        if (col === 3) {
            col = 0;
        }
    });
});
