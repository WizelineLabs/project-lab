### **Contribution Guidelines**

#### **Did you find a bug?**

* **Ensure the bug isn’t reported already** \
Go to the **issues section** of the GitHub repository and search for any open and related bug. 

* **Open a new issue \
I**f you're unable to find an open issue addressing the problem you’ve identified. Ensure to include:
    * **A title and clear description** with relevant information 
    * **A code sample** or an **executable test case** demonstrating the expected behavior that is not occurring. 



#### **Did you write a patch that fixes a bug?**

* Open a[ new GitHub pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) including your changes. 

* Ensure the PR description clearly states the problem and describes the solution. Include the issue number, if applicable. 

* Read the[ ](https://github.com/wizeline/project-lab/blob/main/CODE_OF_CONDUCT.md)CODE-OF-CONDUCT.md before submitting your PR 



#### **Did you fix whitespace, format code, or make a purely cosmetic patch?**

Changes that are cosmetic in nature and do not add anything substantial to the stability, functionality, or testability are not encouraged.


#### **Do you intend to add a new feature or change an existing one?**

* Discuss the new feature with any of the primary maintainers of the project
* Add a **new issue** describing the changes with as much details as possible  and start writing code. 



#### **Branch Naming Conventions**

The following rules are common conventions for naming Git branches:

&lt;grouping-token>/&lt;tracker-number>/&lt;description-tokens>

* Start the branch name with a _[Grouping Token](#heading=h.x2bekdg1lm9f)_
* Add the[ Issue Tracker Number](https://github.com/wizeline/project-lab/blob/main/CONTRIBUTING.md#issue-tracker-number) after the Grouping Token, if available
* End the branch name with[ Description Tokens](https://github.com/wizeline/project-lab/blob/main/CONTRIBUTING.md#description-tokens)
* Separate branch parts using slashes (/)
* Avoid using numbers to start your branch name
* Use short nouns for Grouping and Description Tokens

Examples of branch names are the following:

* group1/XXXX/lead-foo
* group1/YYYY/lead-baz
* group2/lead-bar
* group3/lead-foo


#### **Grouping Tokens**

Grouping Tokens begin the branch name. Use one of the next defined tokens to group branches.

* **feat** for creating or improving a feature.
* **bug** for fixing a bug in an existing feature.
* **test** for adding tests or improving test coverage.
* **chore** for updating tasks that have no production code change.
* **doc** for improving READMEs or other Markdown documents.
* **junk** for experimental features not to be merged.


#### **Issue Tracker Number**

Issue Tracker Number is the naming part following the Grouping Token. It corresponds to the issue number assigned to the feature or bug in the project's issue tracking tool. Examples:

* feat/RSSI-12/order-blueprints
* bug/RSEM-10/sticky-navbar
* test/RCMY-9/post-model-attributes
* junk/RUMS-49/login-bug-test


#### **Description Tokens**

Description Tokens are the naming parts at the end of the branch name. These are personalized tokens that describe your code addition or subtraction. Examples:

* feat/order-blueprints
* bug/sticky-navbar
* test/post-model-attributes
* junk/login-bug-test
