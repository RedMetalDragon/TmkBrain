const UsersController = {
  getDashboardData() {
    return {
        employee_fname: "x",
        employee_mname: "x",
        employee_lname: "x",
        company_name: "Company",
        company_logo: "logo:url",
        last_punch_in: "2023-10-12 08:00:00am",
        last_punch_out: "2023-10-12 05:00:00pm",
        total_hours_worked: "8",
        remaining_pto_balance: "5",
        two_weeks_schedule: [
            {
                date: "2023-10-01",
                in: "08:00:00am",
                out: "05:00:00pm"
            },
            {
                date: "2023-10-02",
                in: "08:00:00am",
                out: "05:00:00pm"
            },
            {
                date: "2023-10-03",
                in: "08:00:00am",
                out: "05:00:00pm"
            },
            {
                date: "2023-10-15",
                in: "08:00:00am",
                out: "05:00:00pm"
            }
        ]
    };
  },

  getAttendance() {
    return [
        {
            date: "2023-10-01",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-02",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-03",
            in: "08:00:00am",
            out: null
        }
    ];
  },

  getSchedule() {
    return [
        {
            date: "2023-10-01",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-02",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-03",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-04",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-05",
            in: "08:00:00am",
            out: "05:00:00pm"
        }
    ];
  },

  login() {
    return {    
        access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpfX21pZW13NGhoTmdvQWQxR3N6ciJ9.eyJodHRwczovL2F1dGguZHRuLmNvbS9jdXN0b21lcklkIjpbIkRJT0dFTkVTMDAxIiwiRGlvZ2VuZXNDdXN0b21lcjAwMSIsIkRpb2dlbmVzQ3VzdG9tZXIwMDIiLCJEVE4wMDAwMDAwMElOVCJdLCJodHRwczovL2F1dGguZHRuLmNvbS9wcm9kdWN0Q29kZSI6InVua25vd24iLCJodHRwczovL2F1dGguZHRuLmNvbS9lbnQiOiJbXSIsImh0dHBzOi8vYXV0aC5kdG4uY29tL3JlcXVlc3RlcklwIjoiMTguMjEzLjE3NC4yNyIsImlzcyI6Imh0dHBzOi8vaWQuYXV0aC5kdG4uY29tLyIsInN1YiI6ImF1dGgwfDYzNWFjNDQ1YTE3YzVjMjQ3NjU2OWIxOSIsImF1ZCI6WyJodHRwczovL2FwaS5hdXRoLmR0bi5jb20iLCJodHRwczovL2R0bi1hdXRoLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2OTcwNzgzODksImV4cCI6MTY5NzE2NDc4OSwiYXpwIjoiNElRNzFyRExDMHltbGhPWmVKbkljR1U3amFFRWhPdUoiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIGFkZHJlc3MgcGhvbmUiLCJndHkiOiJwYXNzd29yZCIsInBlcm1pc3Npb25zIjpbXX0.TU_PARBXSBb1nJuX1QcIiAwLgK4fPq3JwBLaYI8lDLNfC7wx-zXhCKR_E9tMckPIZzIxgE36z0Te_BCk0t3Na_9Eltp1VIxyAR4Tuzy2UbUEPuxFV10XHt759OEwb6rgKAchcft7yZz3oS0gowAxlz_Ihcf4xQpObbBvy6S8VPTXBYV8_qWRj9eOyuwaweWxXF1bfyWw64UBX4Dz5CEmzVaVuys0IX51re8MwEkPMppUTOcHzM1Ic7WLangwJw5SrjucVX_mKtx3WdWb_LP2cw1QOC9qwc9QW-lWk3RSgJJy13ful-gu4cyKS9ikpmubQ4fTWAHnvrpPMi_cQhaq7g",
        expires_in: 86400,
        token_type: "Bearer",
        company_logo: "logo:url"
    };    
  },
  
  attendance() {
    return {    
        message: "Successfully recorded punch in / out.",
        status: 200
    }
  }
}

export { UsersController };
