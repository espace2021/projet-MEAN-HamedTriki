import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/users/user';
import { UserService } from 'src/app/users/user.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  selectedUsers: string[] = [];
  searchInput: string = '';
  loggedInUserId: string | null = null;
  token: string;
  user: any = {};

  constructor(
    private userService: UserManagementService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    public usersService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.token = this.cookieService.get('token');

    if (!this.token) {
      this.toastr.error('Authentication token not found', 'Error');
      return;
    }
    if (this.token) {
      if (this.token) {
        this.usersService.getUserInfo(this.token).subscribe(
          (user: User) => {
            this.user = user;
            this.loggedInUserId = user._id;
          },
          (error) => {
            console.error('Error fetching user details:', error);
          }
        );
      }
    }
  }

  filter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value;

    if (filter.trim() === '') {
      this.fetchUsers();
    } else {
      this.users = this.users.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }

  fetchUsers(): void {
    this.userService.fetchUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleCheckboxChange(userId: string): void {
    if (this.selectedUsers.includes(userId)) {
      this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
    } else {
      this.selectedUsers = [...this.selectedUsers, userId];
    }
  }

  async deleteSelectedUsers(): Promise<void> {
    try {
      const result = await Swal.fire({
        title: `Are you sure you want to delete ${this.selectedUsers.length} users?`,
        text: 'You will not be able to recover this item!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonColor: '#f87171',
        cancelButtonColor: '#fecaca',
      });

      if (result.isConfirmed) {
        await this.userService
          .deleteSelectedUsers(this.selectedUsers)
          .toPromise();
        console.log('Selected users deleted successfully.');
        this.users = this.users.filter(
          (user) => !this.selectedUsers.includes(user._id)
        );
        this.selectedUsers = [];
        Swal.fire({
          title: 'Deleted!',
          icon: 'success',
          text: `You have successfully deleted the selected users.`,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error('Error deleting selected users:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'An error occurred while deleting the users. Please try again.',
        confirmButtonColor: '#f87171',
      });
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonColor: '#f87171',
        cancelButtonColor: '#fecaca',
      });

      if (result.isConfirmed) {
        const res = await this.userService.deleteUser(id).toPromise();
        if (res.ok) {
          this.users = this.users.filter((user) => user._id !== id);
          Swal.fire({
            title: 'Deleted!',
            icon: 'success',
            text: `User has been deleted successfully.`,
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          console.error('Error deleting user:', res);
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'An error occurred while deleting the user. Please try again.',
            confirmButtonColor: '#f87171',
          });
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'An error occurred while deleting the user. Please try again.',
        confirmButtonColor: '#f87171',
      });
    }
  }

  async toggleUserStatus(userId: string, status: boolean): Promise<void> {
    try {
      const response = await this.userService
        .toggleUserStatus(userId, status)
        .toPromise();
      const updatedUsers = this.users.map((user) => {
        if (user._id === userId) {
          return { ...user, status: !status };
        }
        return user;
      });
      this.users = updatedUsers;

      Swal.fire({
        title: 'Update user status!',
        icon: 'success',
        text: ` User ${status ? 'deactivated' : 'activated'} successfully`,
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Failed to update user status.',
        confirmButtonColor: '#f87171',
      });
    }
  }
  toggleAllCheckboxes(event: any): void {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = event.target.checked;
      this.updateSelectedUsers(checkbox.value, checkbox.checked);
    });
  }

  updateSelectedUsers(userId: string, isChecked: boolean): void {
    if (isChecked && !this.selectedUsers.includes(userId)) {
      this.selectedUsers.push(userId);
    } else if (!isChecked && this.selectedUsers.includes(userId)) {
      this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
    }
  }

  openEmailPopup(userId: string, userName: string, userEmail: string): void {
    Swal.fire({
      title: `Send Email to ${userName}`,
      html: `
        <div>
          <label for="emailSubject">Subject:</label>
          <input type="text" id="emailSubject" class="swal2-input" placeholder="Enter subject">
        </div>
        <div>
          <label for="emailText">Text:</label>
          <input type="text" id="emailText" class="swal2-input" placeholder="Enter email text">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const emailSubject = (
          document.getElementById('emailSubject') as HTMLInputElement
        ).value;
        const emailText = (
          document.getElementById('emailText') as HTMLInputElement
        ).value;

        return this.userService
          .sendEmail({ userId, subject: emailSubject, text: emailText })
          .toPromise();
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Email Sent!',
            icon: 'success',
            text: `Email has been sent successfully to ${userName}`,
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Email Cancelled',
            icon: 'info',
            text: `Sending email to ${userName} has been cancelled.`,
          });
        }
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'An error occurred while sending the email. Please try again.',
          confirmButtonColor: '#f87171',
        });
      });
  }
}
