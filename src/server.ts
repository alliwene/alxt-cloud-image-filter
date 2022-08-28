import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { Request, Response } from "express";

// Function to parse error messages
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url }: { image_url: string } = req.query;

    // Validate image_url
    if (!image_url) {
      return res.status(400).send(getErrorMessage("image_url is required"));
    }

    // download, filter, and save the filtered image locally
    try {
      filterImageFromURL(image_url)
        // absolute path to a filtered image locally saved files
        .then((filteredImage) => {
          // send resulting file in the response
          res.status(200).sendFile(filteredImage, (err) => {
            // delete files on the local disk after sending
            if (err) {
              return res.status(400).send(getErrorMessage(err));
            } else {
              deleteLocalFiles([filteredImage]);
            }
          });
        });
    } catch (error) {
      return res.status(422).send(getErrorMessage(error));
    }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
