import express from 'express';
import { User } from '../Models/User';
import { Case } from '../Models/Case';
import { SendNotification, decodeJwtToken, getCurrentDate } from '../service';

let router = express.Router();

//File a New Case
router.post('/file-case', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }

    let { name, mobile, address, incidentSpot, time, incidentDate, details } =
      req.body;
    //Current Date
    let date = getCurrentDate();
    //File a New Case
    const fileCase = await new Case({
      userId,
      name,
      mobile,
      address,
      incidentSpot,
      time,
      incidentDate,
      details,
      filedDate: date,
    }).save();

    //content for notification
    let content = {
      title: 'New Case',
      date,
      isViewed: false,
      case: fileCase._id,
      message: 'Your Case Filed',
    };
    //Send notification to users
    SendNotification({ id: userId, content });

    res.status(201).json({ message: 'Case uploaded Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Get User Case's
router.get('/get-all-case', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let data = await Case.find({ userId });
    res.status(200).json({ message: 'Case Data Got Successfully', case: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//Edit Case
router.put('/edit-case', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);
    let {
      name,
      mobile,
      address,
      incidentSpot,
      time,
      incidentDate,
      details,
      id,
    } = req.body;

    let user = await User.findById({ _id: userId });
    //Checkig is Case is available!
    let case_data = await Case.findById({ _id: id });
    if (!user || !case_data || case_data.userId !== userId) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }

    //Edit Case
    await Case.findByIdAndUpdate(
      { _id: id },
      {
        $set: userId,
        name,
        mobile,
        address,
        incidentSpot,
        time,
        incidentDate,
        details,
      }
    );

    res.status(201).json({ message: 'Case Edited Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Update Case By Admin
router.put('/update-case', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);
    let { updates, takenBy, id } = req.body;
    let user = await User.findById({ _id: userId });
    //Checkig is Case is available!
    let case_data = await Case.findById({ _id: id });
    // eslint-disable-next-line no-undef
    let admin = process.env.admin_email; //Admin Email
    if (
      !user ||
      !case_data ||
      case_data.userId !== userId ||
      admin !== user.email
    ) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let old_updates = case_data.updates;
    updates = [...updates, ...old_updates];
    //Update Case
    await Case.findByIdAndUpdate({ _id: id }, { $set: { updates, takenBy } });

    res.status(201).json({ message: 'Case Updated Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Close Case By User
router.put('/close-case', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);
    let { id } = req.body;
    let user = await User.findById({ _id: userId });
    //Checkig is Case is available!
    let case_data = await Case.findById({ _id: id });
    if (!user || !case_data || case_data.userId !== userId) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    //Current Date
    let closedDate = getCurrentDate();
    let isClosed = true;
    //Close Case
    await Case.findByIdAndUpdate(
      { _id: id },
      { $set: { closedDate, isClosed } }
    );

    res.status(201).json({ message: 'Case Closed Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Delete Case
router.delete('/delete-case/:id', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let id = req.params.id;
    //Deleting Case by Id
    await Case.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: 'Case Deleted Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export let caseRouter = router;
