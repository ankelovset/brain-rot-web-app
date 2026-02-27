import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      demographics,
      video,
      freeRecall,
      multipleChoice,
      cognitiveLoad,
      distraction,
      engagement,
      manipulationCheck,
      qualityControl,
      startedAt,
      completedAt,
    } = body;

    // Validate required sections
    if (
      !demographics ||
      !video ||
      !freeRecall ||
      !multipleChoice ||
      !cognitiveLoad ||
      !distraction ||
      !engagement ||
      !manipulationCheck ||
      !qualityControl
    ) {
      return NextResponse.json(
        { error: 'Missing required sections' },
        { status: 400 }
      );
    }

    // Validate demographics
    if (
      !demographics.age ||
      !demographics.gender ||
      !demographics.education ||
      demographics.isNativeEnglish === undefined ||
      !demographics.englishLevel ||
      !demographics.socialMediaFrequency ||
      !demographics.gameplayFamiliarity
    ) {
      return NextResponse.json(
        { error: 'Missing required demographic fields' },
        { status: 400 }
      );
    }

    // Validate free recall
    if (!freeRecall.everythingRemembered?.trim()) {
      return NextResponse.json(
        { error: 'Missing required free recall fields' },
        { status: 400 }
      );
    }

    // Validate multiple choice
    if (
      !multipleChoice.storyAbout ||
      !multipleChoice.arrivalTime ||
      !multipleChoice.researchRoom ||
      !multipleChoice.kioskPurchase ||
      !multipleChoice.lauraRoom ||
      !multipleChoice.meetingRescheduled ||
      !multipleChoice.arrivalBeforeMeeting ||
      !multipleChoice.colleaguesArrived
    ) {
      return NextResponse.json(
        { error: 'Missing required multiple choice fields' },
        { status: 400 }
      );
    }

    // Validate cognitive load
    if (
      cognitiveLoad.mentallyDemanding === null ||
      cognitiveLoad.hardToFollow === null
    ) {
      return NextResponse.json(
        { error: 'Missing required cognitive load fields' },
        { status: 400 }
      );
    }

    // Validate engagement (visualsEnjoyable required only when not no-video condition)
    const isNoVideoCondition = video?.filename === "01-no-video.mp4";
    if (
      engagement.videoEngaging === null ||
      !engagement.feedResponse ||
      (!isNoVideoCondition && engagement.visualsEnjoyable === null)
    ) {
      return NextResponse.json(
        { error: 'Missing required engagement fields' },
        { status: 400 }
      );
    }

    // Validate distraction (skip when no-background video — step not shown)
    if (!isNoVideoCondition) {
      if (
        distraction.lookingAtBackground === null ||
        distraction.visualsDistracting === null
      ) {
        return NextResponse.json(
          { error: 'Missing required distraction fields' },
          { status: 400 }
        );
      }
      if (
        distraction.visualsDistracting >= 4 &&
        !distraction.experienceOfBackgroundVisuals
      ) {
        return NextResponse.json(
          { error: 'Missing required distraction follow-up (experience of background visuals)' },
          { status: 400 }
        );
      }
    }

    // Validate manipulation check
    if (
      manipulationCheck.fastPaced === null ||
      manipulationCheck.visuallyStimulating === null
    ) {
      return NextResponse.json(
        { error: 'Missing required manipulation check fields' },
        { status: 400 }
      );
    }

    // Validate quality control
    if (
      !qualityControl.attentionCheck ||
      qualityControl.attentionPaid === null ||
      qualityControl.watchedEntireVideo === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required quality control fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'brain-rot-study');
    const collection = db.collection('surveys');

    // Insert the complete survey response
    const result = await collection.insertOne({
      demographics: {
        age: parseInt(demographics.age),
        gender: demographics.gender,
        education: demographics.education,
        isNativeEnglish: demographics.isNativeEnglish,
        englishLevel: demographics.englishLevel,
        socialMediaFrequency: demographics.socialMediaFrequency,
        gameplayFamiliarity: demographics.gameplayFamiliarity,
      },
      video: {
        filename: video.filename,
        timeSpentSeconds: video.timeSpentSeconds ?? 0,
        watchCount: video.watchCount ?? 0,
      },
      freeRecall: {
        everythingRemembered: freeRecall.everythingRemembered,
      },
      multipleChoice: {
        storyAbout: multipleChoice.storyAbout,
        arrivalTime: multipleChoice.arrivalTime,
        researchRoom: multipleChoice.researchRoom,
        kioskPurchase: multipleChoice.kioskPurchase,
        lauraRoom: multipleChoice.lauraRoom,
        meetingRescheduled: multipleChoice.meetingRescheduled,
        arrivalBeforeMeeting: multipleChoice.arrivalBeforeMeeting,
        colleaguesArrived: multipleChoice.colleaguesArrived,
      },
      cognitiveLoad: {
        mentallyDemanding: cognitiveLoad.mentallyDemanding,
        hardToFollow: cognitiveLoad.hardToFollow,
      },
      distraction: {
        lookingAtBackground: distraction.lookingAtBackground,
        visualsDistracting: distraction.visualsDistracting,
        experienceOfBackgroundVisuals: distraction.experienceOfBackgroundVisuals ?? "",
      },
      engagement: {
        videoEngaging: engagement.videoEngaging,
        feedResponse: engagement.feedResponse,
        visualsEnjoyable: engagement.visualsEnjoyable,
      },
      manipulationCheck: {
        fastPaced: manipulationCheck.fastPaced,
        visuallyStimulating: manipulationCheck.visuallyStimulating,
      },
      qualityControl: {
        attentionCheck: qualityControl.attentionCheck,
        attentionPaid: qualityControl.attentionPaid,
        watchedEntireVideo: qualityControl.watchedEntireVideo,
        comments: qualityControl.comments ?? "",
        wasMultitasking: qualityControl.wasMultitasking,
        narrationFocus: qualityControl.narrationFocus,
        distractionFocus: qualityControl.distractionFocus,
        backgroundVisuals: qualityControl.backgroundVisuals,
      },
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json(
      { error: 'Failed to save survey response' },
      { status: 500 }
    );
  }
}
