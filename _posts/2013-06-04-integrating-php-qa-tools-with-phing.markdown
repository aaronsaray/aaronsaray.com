---
layout: post
title: Integrating PHP QA Tools with Phing
tags:
- IDE and Web Dev Tools
- phing
- phpunit
---

If you're not familiar with having [PHP QA Tools](http://phpqatools.org/), go there right now!  And then come back and read this.

I have really found a great joy lately in phing scripts.  I know, really nerdy.  I had on my list of things to do to get phing working with my tests in PHPUnit, and maybe 'do a few other things.'  Well, I'm not done yet, but I have at least integrated some of the standard tools into my phing build task.

Let me post the phing build file, and then I'll go through step by step:

```xml
<project default="help" name="myproject">
    <property override="true" name="basedir" value="."></property>
    <property override="true" name="reportsdir" value="${basedir}/build/reports"></property>
    <property override="true" name="excludedir" value="library/Zend/,build/"></property>
    <property override="true" name="phplocdir" value="${reportsdir}/phploc"></property>
    <property override="true" name="phpcpddir" value="${reportsdir}/phpcpd"></property>
    <property override="true" name="phpmddir" value="${reportsdir}/phpmd"></property>
    <property override="true" name="phpunitdir" value="${reportsdir}/phpunit"></property>
    <property override="true" name="phpcsdir" value="${reportsdir}/phpcs"></property>

    <target name="metrics" description="Software Metrics Generation">
        

        <trycatch>
            <try>
                <echo msg="Starting phploc"></echo>
                <delete quiet="true" dir="${phplocdir}"></delete>
                <mkdir dir="${phplocdir}"></mkdir>
                <echo msg="Starting phploc parsing [this may take a few seconds]"></echo>
                <exec checkreturn="true" executable="phploc">
                    <arg value="--exclude"></arg>
                    <arg value="${excludedir}"></arg>
                    <arg path="${basedir}"></arg>
                    <arg value=">${phplocdir}/output.txt"></arg>
                </exec>
                <echo msg="phploc finished"></echo>
            </try>
            <catch>
                <echo msg="phploc is not installed.  Run 'pear install pear.phpunit.de/phploc'" level="warning"></echo>
            </catch>
        </trycatch>
    </target>

    <target depends="metrics" name="quality" description="Code Quality Measurements">
        
        <trycatch property="phpcsinstalled">
            
            <try>
                <exec checkreturn="true" executable="phpcs">
                    <arg value="--version"></arg>
                </exec>
            </try>
            <catch></catch>
        </trycatch>
        <if>
            <contains substring="with code 127" string="${phpcsinstalled}"></contains>
            <then>
                <echo msg="phpcs is not installed.  Run pear install php_codesniffer" level="warning"></echo>
            </then>
            <else>
                <echo msg="Starting phpcs"></echo>
                <delete quiet="true" dir="${phpcsdir}"></delete>
                <mkdir dir="${phpcsdir}"></mkdir>
                <echo msg="Starting phpcs parsing."></echo>
                <trycatch>
                    <try>
                        <exec logoutput="true" checkreturn="true" executable="phpcs">
                            <arg path="${basedir}/application"></arg>
                            <arg value="--ignore=${excludedir},public/"></arg>
                            <arg value="--standard=Zend"></arg>
                            <arg value="--report-file=${phpcsdir}/output.txt"></arg>
                            <arg value="--report-summary"></arg>
                            <arg value="--report-full"></arg>
                        </exec>
                    </try>
                    <catch></catch>
                </trycatch>
                <echo msg="phpcs finished"></echo>
            </else>
        </if>

        
        <trycatch>
            <try>
                <echo msg="Starting phpcpd"></echo>
                <delete quiet="true" dir="${phpcpddir}"></delete>
                <mkdir dir="${phpcpddir}"></mkdir>
                <echo msg="Starting phpcpd parsing."></echo>
                <exec checkreturn="true" executable="phpcpd">
                    <arg value="--exclude"></arg>
                    <arg value="${excludedir}"></arg>
                    <arg path="${basedir}"></arg>
                    <arg value=">${phpcpddir}/output.txt"></arg>
                </exec>
                <echo msg="phpcpd finished"></echo>
            </try>
            <catch>
                <echo msg="phpcpd is not installed.  Run pear install pear.phpunit.de/phpcpd" level="warning"></echo>
            </catch>
        </trycatch>

        
        <trycatch property="phpmdinstalled">
            
            <try>
                <exec checkreturn="true" command="phpmd"></exec>
            </try>
            <catch></catch>
        </trycatch>
        <if>
            <contains substring="with code 127" string="${phpmdinstalled}"></contains>
            <then>
                <echo msg="phpmd is not installed.  Run pear channel-discover pear.phpmd.org, pear channel-discover pear.pdepend.org, pear install --alldeps phpmd/PHP_PMD. Ignore phpize warning." level="warning"></echo>
            </then>
            <else>
                <echo msg="Starting phpmd"></echo>
                <delete quiet="true" dir="${phpmddir}"></delete>
                <mkdir dir="${phpmddir}"></mkdir>
                <echo msg="Starting phpmd parsing"></echo>
                <trycatch>
                    <try>
                        <exec logoutput="true" checkreturn="true" executable="phpmd">
                            <arg path="${basedir}"></arg>
                            <arg value="text"></arg>
                            <arg value="codesize,controversial,design,naming"></arg>
                            <arg value="--reportfile"></arg>
                            <arg value="${phpmddir}/output.txt"></arg>
                            <arg value="--exclude"></arg>
                            <arg value="${excludedir}"></arg>
                        </exec>
                    </try>
                    <catch></catch>
                </trycatch>
                <echo msg="phpmd finished"></echo>
            </else>
        </if>

        
        <delete quiet="true" dir="${phpunitdir}"></delete>
        <mkdir dir="${phpunitdir}"></mkdir>

        <echo msg="Starting phpunit parsing"></echo>
        <exec checkreturn="true" command="phpunit" dir="${basedir}/tests"></exec>
        <echo msg="phpunit finished"></echo>
    </target>

    <target depends="quality" name="reports" description="Should be ran to launch all report generation"></target>

    <target name="build" description="Used to build application">
        <echo msg="Starting Build"></echo>

        <echo msg="Build Finished."></echo>
    </target>

    <target name="help" description="Shows help for this task">
        <echo msg="Help for this Phing Taskset"></echo>
        <exec logoutput="true" executable="phing">
            <arg value="-l"></arg>
        </exec>
    </target>
</project>
```

Ok, first thing's first: the project tag.  By default, I'm running the help target.  If you scroll down, you'll see that all help does is call an exec out to phing with the -l command.  This gets all targets and displays them as output.  Self generating help.  Nice.

Next, setting up a bunch of properties.  

Next, software metrics section.  This is not really quality based stuff, just a count. 

In general, I delete the report directory for each tool, and then crecreate it.  Quiet = true allows me to not see an error if this is the first time.

PHPLoc (Lines of Code) is ran next.  You'll notice I exclude the Zend Framework Library and the build files.  This is common throughout all sections now.  This particular item happens inside of a try/catch just in case phploc is not installed.  It nicely tells you the way to install the app if you're not sure.  What's nice about this is the exec nested command allows me to put all my arguments as elements, as well as execute a checkreturn - which transfers out exceptions.

The other main task is quality which depends on metrics to be ran first.

Now, with phpcs (PHP_Codesniffer), you'll see I changed up the way of detecting if the tool is installed.  See, phpcs returns 0 if all sniffs pass, or 1(?) if at least one test failed.  The problem is that non-zero return message gets confused with the 127 for file not installed.  Hence, I try to run the version command on phpcs, and then do an if on the phpcsinstalled property (which is set with the return/exception value above) and look for 127.  If it is 127, it means that its not installed.  Otherwise, I start on running phpcs.

Next, phpcpd (Copy Paste Detector) is more standard.  There is a simple try/catch here in case it is not installed.

Next, phpmd is more like phpcs in its generation of return levels.  

Finally, you'll see I have no checking for phpunit - that's because phpunit is installed by default on all of my servers.  If not on yours, you'll have to modify it to be similar to phpcs style.

Finally (again), you'll see a task called 'reports' - which is what I run when I want to check on the quality of the projects.  That way, I don't have to remember the names of the tasks.  I can call 'build' to build, 'deploy' (not shown) to deploy, and 'reports' to generate all available reports.
