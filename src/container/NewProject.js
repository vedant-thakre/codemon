import React, { useEffect, useState } from "react";
import { FaChevronDown, FaCss3, FaHtml5, FaJs } from "react-icons/fa6";
import { FcSettings } from "react-icons/fc";
import SplitPane from "react-split-pane";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Link, useParams } from "react-router-dom";
import { Dark, Light, Logo, sLogo, savesm } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import Alert from "../components/Alert";

const NewProject = () => {
  const user = useSelector((state) => state.user?.user);
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [loggedUser, setloggedUser] = useState(user?.displayName
    ? user?.displayName
    : `${user?.email.split("@")[0]}` );
  const [css, setCss] = useState("");
  const [mode, setMode] = useState("dark");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");
  const [author, setAuthor] = useState("");
  const [isTitle, setIsTitle] = useState("");
  const [title, setTitle] = useState("");
  const [alert, setAlert] = useState(false);

  const projectDocRef = id ? doc(db, "Projects", id) : null;

  const getUsers = () => {
    console.log(author);
    console.log(loggedUser);
  }

  const getProjectData = async () => {
    if (!projectDocRef) {
      console.log("No 'id' parameter available.");
      return;
    }

    // Fetch project data
    try {
      const projectDocSnapshot = await getDoc(projectDocRef);
      if (projectDocSnapshot.exists()) {
        const projectData = projectDocSnapshot.data();
        console.log(projectData);
        const { html, css, js, title } = projectData;
        setHtml(html);
        setCss(css);
        setAuthor(
          projectData?.user?.displayName ||
            (projectData?.user?.email
              ? projectData?.user?.email.split("@")[0]
              : "Author")
        );

        setJs(js);
        setTitle(title);
      } else {
        console.log("Project document does not exist.");
      }
    } catch (error) {
      console.error("Error retrieving project data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectData();
    }
  }, [id, projectDocRef]);

  const updateOutput = () => {
    const combineCode = `
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>${js}</script>
            </body>
        </html>
        `;
    setOutput(combineCode);
  };

  useEffect(() => {
    updateOutput();
  }, [html, css, js]);

  const saveProgram = async () => {
    const id = `${Date.now()}`;
    const _doc = {
      id: id,
      title: title,
      html: html,
      css: css,
      js: js,
      output: output,
      user: user,
    };

    await setDoc(doc(db, "Projects", id), _doc)
      .then((res) => {
        setAlert(true);
      })
      .catch((err) => console.log(err));

    setInterval(() => {
      setAlert(false);
    }, 2000);
  };

  return (
    <>
      <div
        className="w-screen h-screen flex flex-col items-start
       justify-start overflow-hidden"
      >
        {/* alert section */}
        <AnimatePresence>
          {alert && <Alert status={"Success"} alertMsg={"Project Saved"} />}
        </AnimatePresence>

        {/* header section */}
        <header className="w-full flex items-center justify-between pr-2 sm:pr-12 pl-2 sm:pl-8 py-2 sm:py-4 ">
          <div className="flex items-center justify-center gap-0 sm:gap-6">
            <Link to="/home/projects">
              <img
                className="w-32 h-auto object-contain hidden sm:block"
                src={Logo}
                alt="Logo"
              />
              <img
                className="w-8 h-auto mr-2 object-contain sm:hidden"
                src={sLogo}
                alt="C"
              />
            </Link>

            <div className="flex flex-col items-start justify-start">
              {/* title */}
              <div className="flex items-center justify-center gap-3">
                <AnimatePresence>
                  {isTitle ? (
                    <>
                      <motion.input
                        key={"TitleInput"}
                        type="text"
                        placeholder="Your Title"
                        className="px-2 py-1 rounded-md bg-transparent text-primaryText
                         text-base outline-none border-none"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <motion.p
                        key={"titleLabel"}
                        className="px-2 py-1 text-white text-lg"
                      >
                        {title === "" ? "Untitled" : title}
                      </motion.p>
                    </>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isTitle ? (
                    <>
                      <motion.div
                        key={"MdCheck"}
                        whileTap={{ scale: 0.9 }}
                        className=" cursor-pointer"
                        onClick={() => {
                          setIsTitle(false);
                        }}
                      >
                        <MdCheck className=" text-2xl text-emerald-500" />
                      </motion.div>
                    </>
                  ) : (
                    <>
            
                        <motion.div
                          key={"MdEdit"}
                          whileTap={{ scale: 0.9 }}
                          className=" cursor-pointer"
                          onClick={() => {
                            setIsTitle(true);
                          }}
                        >
                          <MdEdit className=" text-2xl text-primaryText" />
                        </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              {/* follow */}
              <div className="flex items-center justify-center px-2  -mt-2 gap-2">
                <p className=" text-primaryText text-sm">
                  {id ? author : loggedUser}
                </p>
              </div>
            </div>
          </div>
          {mode === "dark" ? (
            <motion.img
              whileTap={{ scale: 1.2 }}
              onClick={() => setMode("light")}
              src={Light}
              alt="Light"
              className={`w-10 absolute top-3 sm:top-5 right-32 sm:right-72 cursor-pointer`}
            />
          ) : (
            <motion.img
              whileTap={{ scale: 1.2 }}
              onClick={() => setMode("dark")}
              src={Dark}
              alt="Light"
              className={`w-8 mt-1 ml-1 absolute top-3 sm:top-5 right-32  sm:right-72  cursor-pointer`}
            />
          )}

          {/* user section */}
          {user && (
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                <motion.button
                  onClick={saveProgram}
                  whileTap={{ scale: 0.9 }}
                  className="px-3 sm:px-6 py-1.5 sm:py-2.5 bg-emerald-500
                 cursor-pointer text-lg text-primary font-semibold rounded-md"
                >
                  <p className=" hidden sm:block">Save</p>
                  <img
                    src={savesm}
                    alt=""
                    className="w-7 h-auto object-contain sm:hidden"
                  />
                </motion.button>
              <UserProfileDetails />
            </div>
          )}
        </header>

        {/* coding section */}

        <div>
          {/* horizontal */}
          <SplitPane
            split="horizontal"
            minSize={100}
            maxSize={-100}
            defaultSize={"43%"}
          >
            {/* top coding section */}
            <SplitPane split="vertical" minSize={40} defaultSize={"33%"}>
              {/* html code */}
              <div className=" w-screen sm:w-full h-full flex flex-col items-start justify-start">
                <div className="w-full flex items-center justify-between">
                  <div
                    className="bg-secondary px-2 sm:px-4 sm:ml-0 ml-2 py-2 border-t-4 flex items-center
                     justify-center gap-3 border-t-gray-500 "
                  >
                    <FaHtml5 className="text-xl text-red-500" />
                    <p className=" text-primaryText font-semibold hidden sm:block">
                      HTML
                    </p>
                  </div>
                  {/* icons section */}
                  <div className="cursor-pointer flex items-center justify-center gap-4 px-2 sm:px-4">
                    <FcSettings className="text-xl" onClick={getUsers} />
                    <FaChevronDown className="text-xl text-primaryText hidden sm:block" />
                  </div>
                </div>
                <div className="w-full px-2 overflow-y-scroll">
                  <CodeMirror
                    value={html}
                    height="600px"
                    extensions={[javascript({ jsx: true })]}
                    theme={mode === "dark" ? "dark" : "light"}
                    onChange={(value, viewUpdate) => {
                      setHtml(value);
                    }}
                  />
                </div>
              </div>

              <SplitPane split="vertical" minSize={40} defaultSize={"50%"}>
                {/* css code */}
                <div className="w-full h-full flex flex-col items-start justify-start ">
                  <div className="w-full flex items-center justify-between">
                    <div
                      className="bg-secondary  px-2 sm:px-4 sm:ml-0 ml-2 py-2 border-t-4 flex items-center
                     justify-center gap-3 border-t-gray-500"
                    >
                      <FaCss3 className="text-xl text-sky-500" />
                      <p className=" text-primaryText font-semibold hidden sm:block">
                        CSS
                      </p>
                    </div>
                    {/* icons section */}
                    <div className="cursor-pointer flex items-center justify-center gap-4 px-2 sm:px-4">
                      <FcSettings className="text-xl" />
                      <FaChevronDown className="text-xl text-primaryText hidden sm:block" />
                    </div>
                  </div>
                  <div className="w-full px-2 overflow-y-scroll">
                    <CodeMirror
                      value={css}
                      height="600px"
                      extensions={[javascript({ jsx: true })]}
                      theme={mode === "dark" ? "dark" : "light"}
                      onChange={(value, viewUpdate) => {
                        setCss(value);
                      }}
                    />
                  </div>
                </div>

                {/* js code */}
                <div className="w-full h-full flex flex-col items-start justify-start">
                  <div className="w-full flex items-center justify-between">
                    <div
                      className="bg-secondary  px-2 sm:px-4 sm:ml-0 ml-2 py-2 border-t-4 flex items-center
                     justify-center gap-3 border-t-gray-500"
                    >
                      <FaJs className="text-xl text-yellow-500" />
                      <p className=" text-primaryText font-semibold hidden sm:block">
                        JS
                      </p>
                    </div>
                    {/* icons section */}
                    <div className="cursor-pointer flex items-center justify-center gap-4 px-2 sm:px-4">
                      <FcSettings className="text-xl" />
                      <FaChevronDown className="text-xl text-primaryText hidden sm:block" />
                    </div>
                  </div>
                  <div className="w-full px-2 overflow-y-scroll">
                    <CodeMirror
                      value={js}
                      height="600px"
                      extensions={[javascript({ jsx: true })]}
                      theme={mode === "dark" ? "dark" : "light"}
                      onChange={(value, viewUpdate) => {
                        setJs(value);
                      }}
                    />
                  </div>
                </div>
              </SplitPane>
            </SplitPane>

            {/* bottom result section */}
            <div
              className="bg-white"
              style={{ overflow: "hidden", height: "100%" }}
            >
              <iframe
                title="Result"
                srcDoc={output}
                style={{ border: "none", width: "100%", height: "100%" }}
              />
            </div>
          </SplitPane>
        </div>
      </div>
    </>
  );
};

export default NewProject;
