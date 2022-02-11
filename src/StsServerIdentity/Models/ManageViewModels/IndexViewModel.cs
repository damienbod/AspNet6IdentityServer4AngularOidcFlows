﻿using System.ComponentModel.DataAnnotations;

namespace StsServerIdentity.Models.ManageViewModels;

public class IndexViewModel
{
    public string Username { get; set; }

    public bool IsEmailConfirmed { get; set; }

    [Required(ErrorMessage = "EMAIL_REQUIRED")]
    [EmailAddress(ErrorMessage = "EMAIL_INVALID")]
    public string Email { get; set; }

    [Phone]
    [Display(Name = "Phone number")]
    public string PhoneNumber { get; set; }

    public string StatusMessage { get; set; }
}
