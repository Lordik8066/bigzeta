$(document).ready(function () {
    $('.chart-tab a[data-toggle="tab"]').on('shown.bs.tab', function () {
        $('.chart-tab').addClass('active');
    });

    $('.chart-tab .when-active__close').on('click', function () {
        $('.chart-tab').removeClass('active').find('a[data-toggle="tab"].active').removeClass('active');
        $('.chart-main .tab-pane.active').removeClass('active');
        return false;
    });
});
