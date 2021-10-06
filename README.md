# periods.io timing data
If you would like to add your school to periods.io, allowing for you to easily see the remaining time in class among other features, please follow the below steps and submit a pull request.

We will review the pull request, accept it, and make your schedule live!

## 0. Requirements
You need to have a very basic understanding of computer languages and know YAML syntax. It's super simple to learn if you are familiar with basic programming; watch a quick tutorial on YAML if you are new.

Create a GitHub issue if any of this is unclear and needs to be better explained.

## 1. Basics
Every school on periods.io has a name and an ID.
For example, one of our schools is named "Mountain View High School" and has an id of "mvhs". IDs are entirely lowercase and are not seen by the users; it's used internally.

## 2. The Directory
**You need to choose an ID and name for your school.**

Your ID must be unique but the name does not *technically* need to be unique. However, it's what all users will see, so if your school is also named "Mountain View High School," maybe add some more identifying information like "Mountain View High School, New York."

**Check `data/directory.yml` to see all IDs and names for other schools, and add your ID and name to that file, following the other entries as an example.**

## 3. The Folder
Each school has a folder to store it's schedule data. Those folders can be found in `data`.

**Create a folder for your school in the `data` directory, naming it the ID you chose for your school.**

## 4. school.yml
Schedule data is stored in two files within the folder you just created. If you poke around some other schools, you'll see a `school.yml` file and a `schedule.yml` file.

**To best complete this file, we recommend you use the `data/mvhs/school.yml` file as a frame.**

Fill out the `periods` section of this file with the periods that students should be able to name or add meeting links to (not "Lunch" or "Brunch").

Add each of the possible daily schedules to the file, following the frame for `data/mvhs/school.yml`.

**Do the best you can here. We'll review your work before merging it and can fix any errors.**

## 5. schedule.yml
**Similar to last time, use `data/mvhs/schedule.yml` file as a frame**

The `defaults` section allows you to specify a recurring order of schedules that begins on a certain `start` date and cycles indefinitely.

The `calendar` section allow you to override the defaults on specific days or date ranges.

Some example uses for this could be:
```
6/10/2020-8/17/2020 weekend "Summer Break"
9/7/2020 weekend "Labor Day"
10/18/2020 assembly
11/18/2020-11/25/2020 weekend "Thanksgiving Break"
```

## 5. Pull Request
Submit a pull request with your changes. We will review the schedule, correct errors, and suggest changes. Eventually, we will merge it into the repo, and it will go live on periods.io.

Thanks!
