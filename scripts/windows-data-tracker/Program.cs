using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Automation;
using System.Diagnostics;

namespace WindowsDataTrackerConsoleApp
{
    class WindowsDataTrackerConsoleApp
    {
        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern int GetWindowTextLength(IntPtr hWnd);

        [DllImport("user32.dll")]
        static extern IntPtr GetWindowThreadProcessId(IntPtr hWnd, out IntPtr lpdwProcessId);

        string GetCurrentAppName()
        {
            IntPtr activeAppHandle = GetForegroundWindow();

            IntPtr activeAppProcessId;
            GetWindowThreadProcessId(activeAppHandle, out activeAppProcessId);

            Process currentAppProcess = Process.GetProcessById((int)activeAppProcessId);
            string currentAppName = FileVersionInfo.GetVersionInfo(currentAppProcess.MainModule.FileName).FileDescription;

            return currentAppName;
        }

        Process GetCurrentAppProcess()
        {
            IntPtr activeAppHandle = GetForegroundWindow();

            IntPtr activeAppProcessId;
            GetWindowThreadProcessId(activeAppHandle, out activeAppProcessId);

            Process currentAppProcess = Process.GetProcessById((int)activeAppProcessId);

            return currentAppProcess;
        }

        string GetText(AutomationElement element)
        {
            object patternObj;

            if (element.TryGetCurrentPattern(ValuePattern.Pattern, out patternObj))
            {
                var valuePattern = (ValuePattern)patternObj;
                return valuePattern.Current.Value;
            }
            else if (element.TryGetCurrentPattern(TextPattern.Pattern, out patternObj))
            {
                var textPattern = (TextPattern)patternObj;
                // often there is an extra '\r' hanging off the end.
                return textPattern.DocumentRange.GetText(-1).TrimEnd('\r');
            }
            else
            {
                return element.Current.Name;
            }
        }

        void TreeRecurse(AutomationElement e, string spacing, TreeNode currentNode)
        {
            TreeWalker tw = TreeWalker.ControlViewWalker;
            TreeNode newNode;
            string tabName = "";
            string url = "";

            while (e != null)
            {
                // Dump the full UI tree
                // TODO: Cleaner way to interpolate strings in C#
                newNode = currentNode.Nodes.Add("[" + spacing.Length/2 +"]"+ e.Current.ControlType.Id + " | " + e.Current.ControlType.ProgrammaticName + " | " + e.Current.Name + " | " + GetText(e));

                // Pull out the name of the tab
                if (e.Current.ControlType == ControlType.TabItem)
                {
                    tabName = GetText(e);
                    // Console.WriteLine(tabName);
                }

                // Pull out the name of the URL bar
                // Take note without the Name check ... this will pull out the value of ALL 'edit' controls
                // NOTE: this approach may not work for different langauges may result in a different text
                // maybe look at depth of the tree?
                // maybe look for the refresh control?
                // in the output, the [#] means depth in the UI tree I found the control
                // Console.WriteLine(e.Current.Name);

                if (e.Current.ControlType == ControlType.Edit)
                {
                    string spanishLabel = "Barra de direcciones y búsqueda";
                    string englishLabel = "Address and search bar";

                    if (e.Current.Name.StartsWith(englishLabel) || e.Current.Name.StartsWith(spanishLabel))
                    {
                        url = GetText(e);
                    }
                }

                if (url != "") {
                  Console.WriteLine(url);
                  return;
                }

                //keep going down this tree (child) via recurision
                TreeRecurse(tw.GetFirstChild(e), spacing + "  ", newNode);

                // Traversing ended, time to go to next sibling
                e = tw.GetNextSibling(e);
            }
        }

        // NOTE STAThread is required for Windows Forms functionality to work
        [STAThread]
        static void Main()
        {
            WindowsDataTrackerConsoleApp consoleApp = new WindowsDataTrackerConsoleApp();

            string appName = consoleApp.GetCurrentAppName();

            var strTitle = string.Empty;
            var handle = GetForegroundWindow();
            // Obtain the length of the text
            var intLength = GetWindowTextLength(handle) + 1;
            var stringBuilder = new StringBuilder(intLength);

            if (GetWindowText(handle, stringBuilder, intLength) > 0)
            {
              strTitle = stringBuilder.ToString();
            }

            Console.WriteLine(appName);
            Console.WriteLine(strTitle);

            if (appName != "Microsoft Edge")
            {
              return;
            }

            TreeView treeViewInstance = new System.Windows.Forms.TreeView();
            Process edgeProcess = consoleApp.GetCurrentAppProcess();

            // the chrome process must have a window
            if (edgeProcess.MainWindowHandle == IntPtr.Zero)
            {
              return;
            }

            // Here's Edge
            AutomationElement topE = AutomationElement.FromHandle(edgeProcess.MainWindowHandle);
            // Since the recurision will work through all children, I need to start with the first child of Edge
            TreeWalker tw = TreeWalker.ControlViewWalker;
            TreeNode currentNode = treeViewInstance.Nodes.Add(edgeProcess.ProcessName);

            consoleApp.TreeRecurse(tw.GetFirstChild(topE), "", currentNode);
        }
    }
}
