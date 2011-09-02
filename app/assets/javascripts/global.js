$(function () {
  register_subnav_expand();
  register_datepickers();
  register_journal_controls();
  register_mentor_journal_date_selectors();
  register_schedule_checkboxes();
});

// navigation items with further nesting are handled specially:
// they are not displayed, but clicking on the elements above the sub-sub list
function register_subnav_expand() {
  $('ul > li > ul').parents('li').hide();
  $('ul > li > ul').each(function() {
    $(this).parent().prev().click(function() {
		  $(this).next().toggle('fast');
		  return false;
    });
  });
}

// registers jquery ui datepickers on given fields when applicable
function register_datepickers() {

  var date_settings = {
    usa: false,
    separator: '.',
  };

  var time_settings = {
    isoTime: true,
    separator: '.',
    minTime: {hour: 13, minute: 0},
    maxTime: {hour: 20, minute: 30},
    timeInterval: 15
  };

  $('input.calendricalDate').calendricalDate(date_settings);
  $('#journal_start_at, #journal_end_at').calendricalTimeRange(time_settings)
  $('#kid_meeting_start_at').calendricalTime(time_settings);

}

// register active features on the journal entry form
function register_journal_controls() {
  $('#journal_cancelled').change(function() {
    var show_times = !($(this).is(':checked'));
    $('#journal_start_at_input, #journal_end_at_input').toggle(show_times);
  });
  $('#journal_cancelled').change();
}

// on the mentors page, two selectors allow choosing a filter data for journal
function register_mentor_journal_date_selectors() {
  $('select.select_mentor_journal_date').change(function() {
    var href =  window.location.pathname;
    href += '?month='+$('#date_month').val();
    href += '&year='+$('#date_year').val();
    window.location = href;
  });
}

function register_schedule_checkboxes() {
  $('table.schedule input').change(function(){
    var checkbox = $(this);
    checkbox.attr('disabled', 'disabled'); // disable during ajax request

    if (this.checked) {
      var data = checkbox.data();
      $.ajax({
        url: "/schedules",
        type: 'POST',
        data: { schedule : {
          person_id : $('#person_id').val(),
          person_type : $('#person_type').val(),
          day : data.day,
          hour : data.hour,
          minute : data.minute
        } },
        success: function(data) {
          checkbox.attr('id', data);
          checkbox.removeAttr('disabled');
        } 
      });
    } else {
      $.ajax({
        url: "/schedules/"+checkbox.attr('id'),
        type: 'DELETE',
        success: function(data) {
          checkbox.attr('id', '');
          checkbox.removeAttr('disabled');
        } 
      });
    }
  });
}

function createSchedule(data) {
}