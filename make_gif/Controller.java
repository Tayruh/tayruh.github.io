package sample;


import javafx.fxml.FXML;

import javafx.scene.control.*;
import javafx.scene.input.DragEvent;
import javafx.scene.input.Dragboard;
import javafx.scene.input.TransferMode;

import javafx.stage.FileChooser;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

import java.util.Formatter;
import java.util.Locale;
import java.util.Optional;


public class Controller {
    private String ffmpegPath = "bin\\ffmpeg.exe\"";
    private String ffplayPath = "bin\\ffplay.exe\"";
    private String convertPath = "bin\\convert.exe\"";
    private String gifsiclePath = "bin\\gifsicle.exe\"";

    private String videoFile = "test.mp4";
    private String outputVideo = "gif_video.mp4";
    private String bmpDir = "gif_output";
    private String cwdPath;

    @FXML private TextField videoInput;
    @FXML private TextField gifOutput;
    @FXML private Button loadButton;
    @FXML private Button saveButton;
    @FXML private ToggleButton extract;
    @FXML private TextField start;
    @FXML private TextField duration;
    @FXML private TextField dimension;
    @FXML private RadioButton width;
    @FXML private RadioButton height;
    @FXML private Button encode;

    private String fixPath(String text) {
        if (File.separator.equals("/")) text = text.replaceAll("\\\\", "/");
        else text = text.replaceAll("/", "\\\\");

        //if (text.contains(" ") && text.substring(0, 0) != "\"")
            text = "\"" + text + "\"";
        text = text.replace("\"\"", "\"");

        System.out.println(text);
        return text;
    }

    private static boolean deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            for (File child : dir.listFiles()) {
                boolean success = deleteDirectory(child);
                if (!success) return false;
            }
        }
        return dir.delete();
    }

    private int showAlertPrompt(String text) {
        // 0: exit, 1: okay, 2: cancel
        int result = 0;

        Optional<ButtonType> button = (new Alert(Alert.AlertType.CONFIRMATION, text).showAndWait());
        if (button.isPresent()) result = (button.get() == ButtonType.OK) ? 1 : 2;
        return result;
    }

    private void showAlert(String text) {
        new Alert(Alert.AlertType.INFORMATION, text).showAndWait();
    }

    private StringBuilder runCmd(String command) {  return runCmd(command, "", "");  }

    private StringBuilder runCmd(String command, String arg1) { return runCmd(command, arg1, ""); }

    private StringBuilder runCmd(String command, String arg1, String arg2) {
        System.out.println("CMD : " + command);
        if (!arg1.isEmpty()) System.out.println("ARG1: " + arg1);
        if (!arg2.isEmpty()) System.out.println("ARG2: " + arg2);

        StringBuilder RESULT = new StringBuilder();
        try {
            ProcessBuilder pb = new ProcessBuilder(command, arg1, arg2);
            // Map<String, String> env = pb.environment();
            pb.redirectErrorStream(true);
            Process p = pb.start();

            String input;
            BufferedReader bri = new BufferedReader(new InputStreamReader(p.getInputStream()));

            while ((input = bri.readLine()) != null) {
                System.out.println(input);
                RESULT.append(input);
            }
            System.out.println("Program terminated!");
        }
        catch(Exception ex) {
            ex.printStackTrace();
        }
        return RESULT;
    }

    public void toggleExtract() {
        if (extract.isSelected()) {
            extract.setText("OFF");
            start.setDisable(true);
            duration.setDisable(true);
        }
        else {
            extract.setText("ON");
            start.setDisable(false);
            duration.setDisable(false);
        }
    }

    public void doOnDrag(DragEvent event) {
        Dragboard db = event.getDragboard();
        if (db.hasFiles()) event.acceptTransferModes(TransferMode.COPY);
        event.consume();
    }

    public void doOnDrop(DragEvent event) {
        Dragboard db = event.getDragboard();

        if (db.hasFiles()) {
            for (File file : db.getFiles()) {
                String absolutePath = file.getAbsolutePath();
                System.out.println(absolutePath);
                videoInput.setText(absolutePath);
                break;
            }
            event.setDropCompleted(true);
        } else {
            event.setDropCompleted(false);
        }
        event.consume();
    }

    public void doLoadFile() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Video File (.mkv, .mp4, .m4v, .avi, .ts, .flv)", "*.mkv", "*.mp4", "*.m4v", "*.avi", "*.ts", "*.flv"));
        File selectedFile = fileChooser.showOpenDialog(null);


        if (selectedFile != null) {
            //showAlert("File selected: " + selectedFile.getPath());
            videoInput.setText(selectedFile.getPath());
        } else {
            //showAlert("File selection cancelled.");
        }
    }

    public void doSaveFile() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("GIF File (*.gif)", "*.gif"));
        File selectedFile = fileChooser.showSaveDialog(null);
        if (selectedFile != null) {
            //showAlert("File selected: " + selectedFile.getPath());
            gifOutput.setText(selectedFile.getPath());
        } else {
            //showAlert("File selection cancelled.");
        }
    }

    public void performEncoding() {
        Formatter fmt = new Formatter(new StringBuilder(), Locale.US);

        encode.setDisable(true);

        videoFile = videoInput.getText();

        File f = new File(videoFile);
        if (!f.isFile()) {
            showAlert("Could not find video file!");
            encode.setDisable(false);
            return;
        }

        String workingDir = f.getParent();
        String bmpDirMask = cwdPath + "/" + bmpDir + "/frame_%04d.bmp";

        String outputGif = gifOutput.getText();
        if (outputGif.isEmpty()) outputGif = "gif_output.gif";
        if (!outputGif.substring(outputGif.length() - 4).toLowerCase().equals(".gif")) outputGif += ".gif";
        if (new File(outputGif).getParent() == null) outputGif = workingDir + "\\" + outputGif;

        //if (1==1) return;

        f = new File(cwdPath + "/" + bmpDir);
        System.out.println("Status of Directory: " + f.exists() + ", " + bmpDir);
        if (f.exists()) System.out.println("Deleted: " + deleteDirectory(f));
        f.mkdir();

        f = new File(cwdPath + "/" + outputVideo);
        System.out.println("Status of File: " + f.exists() + ", " + outputVideo);
        if (f.exists()) System.out.println("Deleted: " + f.delete());

        String seek;
        String offset = "00:01:00";

        if (extract.isSelected()) {
            seek = "";
            offset = "";
        } else {
            String[] hms = start.getText().split(":");

            int h = Integer.parseInt(hms[0]);
            int m = Integer.parseInt(hms[1]);
            int s = Integer.parseInt(hms[2]);

            if (m > 0) m -= 1;
            else {
                if (h > 0) {
                    h -= 1;
                    m = 59;
                } else offset = "";
            }

            seek = String.format("%02d", h) + ":" + String.format("%02d", m) + ":" + String.format("%02d", s);

            System.out.println("SEEK: " + seek);
            System.out.println("OFFSET: " + offset);

            //if (1==1) return;

            if ((h + m + s) > 0) seek = "-ss " + seek;
            else seek = "";
            if (!offset.isEmpty()) offset = " -ss " + offset;
        }

        String resolution;

        if (width.isSelected()) resolution = dimension.getText() + ":-2";
        else resolution = "-2:" + dimension.getText();

        //ffmpeg -ss %SEEK% -i %VID_INPUT% -ss %START% -vf scale=%RES% -c:v libx264 -preset placebo -r 24 -an -t %DUR% %VID_OUTPUT%

        //String ffmpegCommand = seek + " -y -i \"" + videoInput.getText() + "\"" + offset + " -vf scale=" + resolution + " -c:v libx264 -preset placebo -r 24 -an -t " + duration.getText() + " " + outputVideoQ;
        String ffmpegCommand = String.format("%1$s -y -i %2$s %3$s -vf scale=%4$s -c:v libx264 -preset placebo -r 24 -an -t %5$s %6$s", seek, fixPath(videoInput.getText()), offset, resolution, duration.getText(), fixPath(outputVideo));

        runCmd(ffmpegPath + " " + ffmpegCommand);

        showAlert("Video has been extracted to " + fixPath(outputVideo) + ".\n\nThe video will now be displayed. Please check whether the video is as desired.\n\nPress [ESC] to close the video.");

        runCmd(String.format("%1$s -loop 0 %2$s"), ffplayPath, fixPath(outputVideo));

        if (showAlertPrompt("Continue with this video?") != 1) {
            encode.setDisable(false);
            return;
        }

        //ffmpeg -i "%VID_OUTPUT%" "%GIF_PATH%/frame_%%04d.bmp"

        runCmd(String.format("%1$s -i %2$s %3$s", ffmpegPath, fixPath(outputVideo), fixPath(bmpDirMask)));

        showAlert("Frames have extracted to " + fixPath( bmpDir) + ".\n\nThe directory will now be displayed. Please remove any frames that should not be included in final animation.");

        runCmd("explorer", fixPath(bmpDir));

        if (showAlertPrompt("Continue with these frames?") != 1) {
            encode.setDisable(false);
            return;
        }

        showAlert("This process may take a while. Please give it time.");

        //convert -delay %DELAY% -loop 0 -layers optimize-plus *.bmp temp.gif

        runCmd(String.format("%1$s -delay 4 -loop 0 -layers optimize-plus %2$s %3$s", fixPath(convertPath), fixPath(cwdPath + "/" + bmpDir + "/*.bmp"), fixPath(cwdPath + "/" + bmpDir + "/temp.gif")));

        //gifsicle --lossy=30 temp.gif -o %GIF%

        runCmd(String.format("%1$s --lossy=30 %2$s -o %3$s", gifsiclePath, fixPath(cwdPath + "/" + bmpDir + "/temp.gif"), fixPath(outputGif)));

        f = new File(fixPath(cwdPath + "/" + bmpDir));
        deleteDirectory(f);

        f = new File(fixPath(cwdPath + "/" + outputVideo));
        f.delete();

        System.out.println("Completed Successfully!");

        showAlert("GIF created succesfully at " + fixPath(outputGif) + ".\n\nThe finished gif will now be displayed.\n\nPress [ESC] to close the animation.");

        runCmd(ffplayPath + " -loop 0 " + fixPath(outputGif));

        runCmd("explorer", "/select,", fixPath(outputGif));

        encode.setDisable(false);
    }

    public void initialize() {
        File f = new File(fixPath("bin/ffmpeg.exe"));
        if (!f.exists()) f = new File(fixPath("src/bin/ffmpeg.exe"));
        //cwdPath = (f.getParent() != null) ? (new File(f.getParent())).getAbsolutePath() : f.getAbsolutePath();
        cwdPath = (f.getParent() != null) ? f.getParent() : "";

        ffmpegPath = fixPath(cwdPath + "/ffmpeg.exe");
        ffplayPath = fixPath(cwdPath + "/ffplay.exe");
        convertPath = fixPath(cwdPath + "/convert.exe");
        gifsiclePath = fixPath(cwdPath + "/gifsicle.exe");


        /*
        UnaryOperator<Change> filter = change -> {
            String text = change.getText();

            if (text.matches("[0-9]*")) {
                return change;
            }

            return null;
        };
        TextFormatter<String> textFormatter = new TextFormatter<>(filter);
        fieldNport = new TextField();
        fieldNport.setTextFormatter(textFormatter);
        */
    }
}

