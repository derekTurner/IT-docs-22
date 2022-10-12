## Setting up PC 

This module will use a MERN stack to create a web application.
The primary editor will be Visual Studio Code.
Docker containers will be used to manage the development environment.
Windows Subsystem for Linux WSL2 will be required to support Docker running Windows 11 (or windows 10).

## Visual Studio Code

Visual studio code is a lightweight code editor, that is what is required here.  This is not the same as Visual Studio which is an integrated development environment.  Please take care to install VSC and not VS!

Visual Studio Code can be downloaded [here](https://code.visualstudio.com/)

![download VSC](vscWebsite.png)

Open the extensions dialogue either by CTRL + Shift + X or clicking on the extensions icon on the left of the VSC display.

You will see a range of popular extensions which you can install.

If you don't see the extension you require listed you can just type the name in the extensions search bar.

Type Live Server in the search bar.

![Live Server extension](liveServer.png)

Installing  this will allow any website code in the editor to be previewed in a browser.

Further extensions will be installed to VSC as required.

## WSL 

Windows subsystem for Linux is easy to install on windows version beyond Windows 10 Home Version 21H1

The current system used a the time of writing these notes is:

    Edition:	Windows 11 Home

    Version:	21H2

    OS build:	22000.832

    Experience:	Windows Feature Experience Pack 1000.22000.832.0


WSL allows a command line linux distribution to be installed.  This is essentially needed to support the Docker application.

It is possible to go on to allow GUI linux applications to run on the PC, but this is not required for the present purpose.

Microsoft documents supporting WSL can be found [here](https://docs.microsoft.com/en-us/windows/wsl/).

Windows powershell is likely to be on a PC in version 5.1.  Version 7.2 is the current version and this features support for docker containers.  Microsoft documentation discusses how to [migrate from powershell 5.1 to Powershell 7](https://docs.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7?view=powershell-7.2)

I will [download Powershell 7](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2) and install this with all default options along side powershell 5.1

For a fresh installation of WSL open powershell *as an administrator* and enter the command:

> wsl --install

![powershell 7](powershell7.png)

The process takes a few minutes.

```code
PS C:\Windows\System32> wsl --install
Installing: Virtual Machine Platform
Virtual Machine Platform has been installed.
Installing: Windows Subsystem for Linux
Windows Subsystem for Linux has been installed.
Downloading: WSL Kernel
Installing: WSL Kernel
WSL Kernel has been installed.
Downloading: GUI App Support
Installing: GUI App Support
GUI App Support has been installed.
Downloading: Ubuntu
The requested operation is successful. Changes will not be effective until the system is rebooted.
PS C:\Windows\System32>
```

At this point a **system restart** is required.

When the computer restarts it opens a Linux window.

The default Linux distribution is Ubuntu.  Once it has loaded this will need a username and password.  Of course you should remember this!  However, there is advice [here](https://docs.microsoft.com/en-us/windows/wsl/setup/environment#set-up-your-linux-username-and-password) what to do if you forget your password.

![enter password](enterPassword.png)

Enter username and then password correctly typed twice.

```code
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: derek
New password:
Retype new password:
passwd: password updated successfully
Installation successful!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.10.16.3-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Aug  8 15:06:01 BST 2022

  System load:  0.0                Processes:             8
  Usage of /:   0.4% of 250.98GB   Users logged in:       0
  Memory usage: 7%                 IPv4 address for eth0: 172.31.243.122
  Swap usage:   0%

0 updates can be installed immediately.
0 of these updates are security updates.


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


This message is shown once once a day. To disable it please create the
/home/derek/.hushlogin file.
derek@TurnerHub:~$
```
Note that you as a named user do not have full privelidges on the system.  This is reserved for the root user.  In general it is preferred not to go in as the root user to protect yourself from causing dabage from an unitentional code error.  If you need to do an operation which requires root privelidges you can use the sudo command.

Opening powerShell again, you can confirm which version of WSL you have with 

>wsl -l -v

WSL should be maintained in the background by windows update, but if you want to manually update you can enter in powershell (still as administrator)

> wsl --update

```code
Checking for updates...
Downloading updates...
Installing updates...
This change will take effect on the next full restart of WSL. To force a restart, please run 'wsl --shutdown'.
Kernel version: 5.10.102.1
PS C:\Windows\System32>
```

>wsl --shutdown

```code
  NAME      STATE           VERSION
* Ubuntu    Running         2
```
To see what version of Ubuntu you are running go to the Ubuntu window and issue:

> lsb_release -a

```code
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04 LTS
Release:        20.04
Codename:       focal
```

This is not the most recent version of Ubuntu, but I don't reccommend trying to change release version at this point.

You can close both powershell and the ubuntu window now.

## Docker

Docker Desktop is the windows installation which includes all you need to work with Docker containers.

Before using this you must check that virtualization is enabled in your BIOS.  

You should use CTRL + ALT + DEL to open task manager and look that virtualisation is enabled under the performance tab.

![virtualization enabled](virtualization.png)

Install docker from [Docker hub](https://docs.docker.com/desktop/install/windows-install/).


![download docker](downloadDocker.png) and install.

Installation runs through:

![install docker](installDocker.png)

You must log out of windows to complete installation, so log out.  This is less drastic than a restart all you need to do is enter your pin to get back and the service agreement appears.

Note that docker is free for personal use and education.

![docker is free](dockerFree.png)

Startup docker desktop.

A whale icon appers in the system tray.  This animates whilst docker is starting.

![docker in system tray](dockerTray.png)

Right click the tray icon to see a menu.

![docker system tray menu](trayMenu.png)

At this point docker has not completed startup.  When startup is complete Docker desktop offers a tutorial - but dont follow this yet.  Click on the settings cog wheel icon next to the sign in.

Click on the option to use composeV2

![enable compose V2](enableComposeV2.png)

Then apply and restart.

Now you can quit docker desktop from the system tray menu.

![quit docker](quitDocker.png)

## Github

If you dont already have one, [open a github account](https://github.com/join?source=login).  I suggest using your email address as password.

When you join there is a short tutorial available to explain what gitHub is but from our point of view it is an online repository which will contain a copy of the code which you are using in your docker containers.

![github home](githubHome.png)

## Github desktop

This is an application which is a convenience utility to help manage the maintenance of copies of the git repositories on your local machine.  I find it useful, it is not strictly necessary but easier than tryint to manage git commands directly.

[Install Github desktop](https://desktop.github.com/)

![github desktop site](githubDesktopSite.png)

Once installed, you can sign into your gitHub account.

![Github Desktop Login](githubDesktopLogin.png)
]

You will be prompted to allow the desktop to open the github account online where you will be able to enter your login details.

![allo desktop to link to gitHub](allowGitHub.png)

Your gitHub user name name and email will appear in the configure git screen

click on "Finish"

![get Started](getStarted.png)

You can experiment with the tutorial repository, but for now installation is complete.

To log out (breaking the link to your online account and keeping your files safe) go to the File options menu or key in CTRL "+".

![sign out of github](signout.png)

You can close github desktop now.

## Git

Git is an application which will allow visual studio code to interact with GitHub Directly.  Github desktop has git built in, but to use it with VSC you must explicitly install git.

Undoubtedly you will decide wheter you prefer to manage your github files from Desktop or VSC, but to have both options available is useful.

Download git [here](https://git-scm.com/).  You will find an online book on git here, but you dont need to issue git commands directly if you use VSC.

![git logo](git.png)

There is a 64-bit Git for windows setup.

Accept the default location.

![git location](gitLocation.png)

Accept the default components.

![git components](defaultComponents.png)

Accept the default Start folder.

![git start menu folder](startMenu.png)

Change the default editr from Vim to Visual Studio Code.

![default editor](gitEditor.png)

Change the name of the inital branch to "main"

![initial branch](initialBranch.png)

Accept the default path to allow git from powerShell.

![git command Line](commandLine.png)

Use the default bundled SSH shell.

![bundled shell](bundledShell.png)

Accept the default SSL library.

![sslLibrary](sslLibrary.png)

Accept the default windows style checkout.

![checkout windows style](checkout.png)

Use the default minTTY terminal emulator.

![terminal editor](terminal.png)

Accept default pull behaviour.

![pull behaviour](pullBehaviour.png)

Accept default credential manager.

![credential manager](credential.png)

Enable default file caching.

![default caching](caching.png)

Don't require experimental features.

![no experimental features](experimental.png)

Install.

When installation has completed, that is enough, no need to start now or view release notes.

![git completed](gitCompleted.png)

Finish!

Reload Visual Studio Code.

The source control icon in visual studio will now allow you to interact directly with gitHub.

![source control](sourceControl.png)

## VSC extensions

From the extensions menu search for the following useful extensions.

Docker

![docker extension](dockerExtension.png)

Remote containers

![remote containers](remoteContainers.png)

That is sufficient set up and these features will be used as the module progresses.