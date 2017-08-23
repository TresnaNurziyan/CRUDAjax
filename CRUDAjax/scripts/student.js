// Load Data in Table when documents is ready
$(document).ready(function () {
    loadData();
    $('#EnrollmentDatePicker input').datepicker({
        format: "dd-mm-yyyy"
    });
    var table;
});

// Load Data function
function loadData() {
    $.ajax({
        url: "/Home/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            //var html = '';
            //$.each(result, function (key, item) {
            //    html += '<tr>';
            //    html += '<td style="width: 50px">' + item.ID + '</td>';
            //    html += '<td>' + item.LastName + '</td>';
            //    html += '<td>' + item.FirstName + '</td>';
            //    html += '<td style="width: 180px">' + formatDate(item.EnrollmentDate) + '</td>';
            //    html += '<td style="width: 180px"><button type="button" class="btn btn-warning" onclick="return getbyID(' + item.ID + ')"><span class="glyphicon glyphicon-edit"></span>Edit</button> | '
            //        + '<button type="button" class="btn btn-danger" onclick="Delete(' + item.ID + ')"><span class="glyphicon glyphicon-remove"></span>Delete</button></td>';
            //    html += '</tr>';
            //});
            //$('.tbody').html(html);
            console.log(result);
            table = $('#data').DataTable({
                "retrieve": true,
                "processing": true,
                "order": [[3, "desc"]],
                //"data": result,
                "ajax": {
                    "url": "/Home/List",
                    "dataSrc": ""
                },
                "columns": [
                    { "data": "ID" },
                    { "data": "LastName" },
                    { "data": "FirstName" },
                    {
                        "data": "EnrollmentDate",
                        "render": function (data) {
                            if (data != null) {
                                return moment(data).format('DD-MM-YYYY');
                            }
                            else {
                                return "Not Available";
                            }
                        }
                    },
                    {
                        "mRender": function (data, type, row) {
                            return '<button type="button" class="btn btn-warning" onclick="return getbyID(' + row.ID + ')"><span class="glyphicon glyphicon-edit"></span>Edit</button>' + ' ' +
                                '<button type="button" class="btn btn-danger" onclick="Delete(' + row.ID + ')"><span class="glyphicon glyphicon-remove"></span>Delete</button>';
                        }
                    }
                ]
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Add Data Function
function Add() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var perObj = {
        ID: $('#ID').val(),
        LastName: $('#LastName').val(),
        FirstName: $('#FirstName').val(),
        EnrollmentDate: $('#EnrollmentDate').val(),
        Discriminator: 'Student'
    };
    $.ajax({
        url: "/Home/Add",
        data: JSON.stringify(perObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $('#myModal').modal('hide');
            $('.modal-backdrop').remove();
            loadData();
            table.ajax.reload(null, false);
            $('#talert').removeClass();
            $('#talert').addClass('alert alert-success');
            $('#talert').html("<p>Data added successfully</p>");
            $('#talert').fadeTo(2000, 500).slideUp(500, function () {
                $('#talert').empty();
                $('#talert').slideUp(500);
            });
        },
        error: function (errormessage) {
            var html = '';
            alert(errormessage.responseText);
            $('#talert').removeClass();
            $('#talert').addClass('alert alert-danger');
            $('#talert').html("<p>Data added failed</p>");
            $('#talert').fadeTo(2000, 500).slideUp(500, function () {
                $('#talert').empty();
                $('#talert').slideUp(500);
            });
        }
    });
}

//Function for getting the Data Based upon Person ID
function getbyID(ID) {
    $('#LastName').css('border-color', 'lightgrey');
    $('#FirstName').css('border-color', 'lightgrey');
    $('#EnrollmentDate').css('border-color', 'lightgrey');
    $.ajax({
        url: "/Home/getbyID/" + ID,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ID').val(result.ID);
            $('#LastName').val(result.LastName);
            $('#FirstName').val(result.FirstName);
            $('#EnrollmentDate').val(formatDate(result.EnrollmentDate));
            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

//function for updating employee's record
function Update() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var empObj = {
        ID: $('#ID').val(),
        LastName: $('#LastName').val(),
        FirstName: $('#FirstName').val(),
        EnrollmentDate: $('#EnrollmentDate').val(),
        Discriminator: 'Student',
    };
    $.ajax({
        url: "/Home/Update",
        data: JSON.stringify(empObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            loadData();
            $('#myModal').modal('hide');
            $('#ID').val("");
            $('#LastName').val("");
            $('#FirstName').val("");
            $('#EnrollmentDate').val("");
            table.ajax.reload(null, false);
            $('#talert').removeClass();
            $('#talert').addClass('alert alert-success');
            $('#talert').html("<p>Data updated successfully</p>");
            $('#talert').fadeTo(2000, 500).slideUp(500, function () {
                $('#talert').empty();
                $('#talert').slideUp(500);
            });
        },
        error: function (errormessage) {
            var html = '';
            alert(errormessage.responseText);
            $('#talert').removeClass();
            $('#talert').addClass('alert alert-danger');
            $('#talert').html("<p>Data update failed</p>");
            $('#talert').fadeTo(2000, 500).slideUp(500, function () {
                $('#talert').empty();
                $('#talert').slideUp(500);
            });
        }
    });
}

//function for deleting person's record
function Delete(ID) {
    var ans = confirm("Are you sure you want to delete this Record?");
    if (ans) {
        $.ajax({
            url: "/Home/Delete/" + ID,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                var html = '';
                loadData();
                table.ajax.reload(null, false);
                $('#talert').removeClass();
                $('#talert').addClass('alert alert-warning');
                $('#talert').html("<p>Data deleted successfully</p>");
                $('#talert').fadeTo(2000, 500).slideUp(500, function () {
                    $('#talert').empty();
                    $('#talert').slideUp(500);
                });
            },
            error: function (errormessage) {
                var html = '';
                alert(errormessage.responseText);
                $('#talert').removeClass();
                $('#talert').addClass('alert alert-danger');
                $('#talert').html("<p>Data delete failed</p>");
                $('#talert').fadeTo(2000, 500).slideUp(500, function () {
                    $('#talert').empty();
                    $('#talert').slideUp(500);
                });
            }
        });
    }
}

//Function for clearing the textboxes
function clearTextBox() {
    $('#ID').val("");
    $('#LastName').val("");
    $('#FirstName').val("");
    $('#EnrollmentDate').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    //$('#Name').css('border-color', 'lightgrey');
    $('#LastName ').css('border-color', 'lightgrey');
    $('#FirstName').css('border-color', 'lightgrey');
    $('#EnrollmentDate').css('border-color', 'lightgrey');
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#LastName').val().trim() == "") {
        $('#LastName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#LastName').css('border-color', 'lightgrey');
    }
    if ($('#FirstName').val().trim() == "") {
        $('#FirstName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#FirstName').css('border-color', 'lightgrey');
    }
    return isValid;
}

function formatDate(date) {
    //console.log(date)
    if (date != null) {
        return moment(date).format('DD-MM-YYYY');
    }
    else {
        return "Not Available";
    }
}


