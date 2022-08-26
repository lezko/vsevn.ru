$(document).ready(function () {
    $('.tabs__btn, .sort__btn').on('click', function () {
        $(this).parent().children().removeClass('active')
        $(this).addClass('active');
    });
    $('.city__delete').on('click', function () {
        $(this).parent().remove();
    });

    $('.btn-menu').on('click', function () {
        $('.header-mob__top, .btn-menu').toggleClass('active')
        $('.header-mob').slideToggle()
    })

    // moment.locale('ru');
    
    $("#dateRangePicker").dateRangePicker({
        language: 'ru',
        separator: ' to ',
        getValue: function () {
            if ($('#inpDate').val() && $('#inpDate2').val())
                return $('#inpDate').val() + ' to ' + $('#inpDate2').val();
            else
                return '';
        },
        setValue: function (s, s1, s2) {
            $('#inpDate').val(s1);
            $('#inpDate2').val(s2);
        },
        monthSelect: true,
        yearSelect: true,
        showTopbar: false,
        format: 'DD-MM-YYYY',
    });



    $('.toSplit').on('input', function (e) {
        this.value = this.value.replace(/ /g, "");
        this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    });

    $('body').on('click', '.listing-activs .tabs__btn', function () {
        switch ($(this).attr('data-tab')) {
            case "active":
                $('.action-remove, .action-delete, .inp-checkbox.main').show();
                $('.action-active, .action-clean').hide();
                break;
            case 'сompleted':
                $('.action-active, .action-delete, .inp-checkbox.main').show();
                $('.action-clean, .action-remove').hide();
                break;
            case 'blocked':
            case 'rejected':
            case 'whait':
                $('.action-active, .action-delete, .action-clean, .action-remove, .inp-checkbox.main').hide();
                break;
            case 'drafts':
                $('.action-active, .action-clean, .action-remove').hide();
                $('.action-delete, .inp-checkbox.main').show();
                break;
            case 'deleted':
                $('.action-active, .action-delete, .action-remove').hide();
                $('.action-clean, .inp-checkbox.main').show();
                break;

        }
    })

    $('body').on('click', '.listing-activs .sort__btn', function () {
        switch ($(this).attr('data-items')) {
            case "cv":
                $('.item-job').hide();
                $('.item-cv').show();
                break;
            case "jobs":
                $('.item-cv').hide();
                $('.item-job').show();
                break;
            case "all":
                $('.item').show();
                break;
        }
    })

    $('body').on('click', '.inp-checkbox input', function () {
        let inps = $('.inp-checkbox input:checked')[0];
        if (inps) {
            $('.sort-action').removeAttr('disabled');
            $('.listing-action').addClass('sticky');
        } else {
            $('.sort-action').attr('disabled', 'disabled')
            $('.listing-action').removeClass('sticky');
        }
        let inpCheck = $('.inp-checkbox input')
        if ($(this).parent().hasClass('main')) {
            for (let index = 0; index < inpCheck.length; index++) {
                if (inpCheck[index].checked == true) {
                    for (let i = 0; i < inpCheck.length; i++) {
                        $(inpCheck[i]).prop('checked', true)
                        $('.sort-action').removeAttr('disabled')
                        $('.listing-action').addClass('sticky');
                    }
                } else {
                    for (let i = 0; i < inpCheck.length; i++) {
                        $(inpCheck[i]).prop('checked', false)
                        $('.sort-action').attr('disabled', 'disabled')
                        $('.listing-action').removeClass('sticky');
                    }
                }

            }
        }
    });

    $('.delete-btn').on('click', function () {
        let inpCheck = $('.inp-checkbox input')
        for (let index = 0; index < inpCheck.length; index++) {
            if (inpCheck[index].checked) {
                $(inpCheck[index]).parents('.item').remove();
                $('#modal-del').fadeOut();
            } else { $('.sort-action').attr('disabled', 'disabled') }
        } if ($('.item').length == 0) { $('.sort-action').attr('disabled', 'disabled') }
    })

    $(function () {
        function showModal(id) {
            $(id).fadeIn(300);
        }

        function hideModals() {
            $('.modal').fadeOut();
        };

        $('.action-delete, .action-clean').on('click', function (e) {
            showModal('#modal-del');
        });


        $('.modal-close, .close-modal').on('click', function () {
            hideModals();
        });

        $(document).on('click', function (e) {
            if (!(
                ($(e.target).parents('.modal-content').length) ||
                ($(e.target).parents('.services-item').length) ||
                ($(e.target).hasClass('modal-content')) ||
                ($(e.target).hasClass('action-delete')) ||
                ($(e.target).hasClass('action-clean')) ||
                ($(e.target).hasClass('modal-open'))
            )) {
                hideModals();
            }
        });

    });

    $(".cv-copy").on('click', function () {
        var text = $(this).parent().children('a').attr('href')
        // console.log(text)
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        $(this).text('Ссылка скопирована')
        document.execCommand("copy");
        setTimeout(() => {
            $(this).text('Скопировать ссылку')
        }, 3000);
        $temp.remove();
    });

    // ---------------- select ----------

    $('select').each(function () {
        var $this = $(this), numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
            if ($this.children('option').eq(i).is(':selected')) {
                $('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('is-selected')
            }
            if ($this.children('option').eq(i).prop('disabled')) {
                $('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('disabled')
            }
            if ($this.children('option').eq(i).prop('hidden')) {
                $('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('hidden')
            }
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function (e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function () {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
            $list.hide();
            //console.log($this.val());
        });

        $(document).click(function () {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    });

    // ------------------------------------



});