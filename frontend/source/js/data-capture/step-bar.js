/* global jQuery, document */

window.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.step-bar__bubbles li');
  const stepLabels = document.querySelectorAll('.step-bar__labels li');
  const currentStep = document.querySelector('.step-bar__labels .current');

  // Add event listeners to show/hide labels corresponding to hovered-over step bubble
  const setUpStepBar = () => {
    // Hide the label that was visible
    const hidePrevLabel = () => {
      const prevLabel = document.querySelector('.step-bar__labels .js-show');
      prevLabel.classList.remove('js-show');
    };

    // Show the label corresponding to the hovered-over bubble
    const showLabel = (selectedLabel) => {
      hidePrevLabel();
      selectedLabel.classList.add('js-show');
    };

    const getIndexOfClass = (classname, nodes) => {
      let itemIndex;
      nodes.forEach((item, i, listObj) => {
        if (item.className == classname) {
          itemIndex = i;
        }
      });
      return itemIndex;
    }

    // Create the link for each step. Ideally we would do this in the Django
    // view frontend/steps.py, but accessing URL patterns from that file creates
    // a circular import. Attempted in https://github.com/18F/calc/pull/1981
    // This code assumes the path of the page is in the form of
    // /data_capture/step/1 or /bulk_upload/step/23, i.e., the step number is at
    // the end of the URL as per our current established patterns in urls.py
    const createPath = () => {
      let path = window.location.pathname;
      const currentStepNum = getIndexOfClass('current', steps) + 1;
      // Remove the step number from the end of the path
      const re = new RegExp(`${currentStepNum}$`);
      return path.replace(re, '');
    }

    const addLink = (path, step, stepNum) => {
      const emptyLink = step.getElementsByTagName('a')[0];
      const relativeUrl = path + stepNum;
      emptyLink.setAttribute('href', relativeUrl);
    }

    // set it all up
    const path = createPath();
    for (let i = 0; i < steps.length; i++) {
      // find the step label with the same index as the hovered-over step bubble
      steps[i].addEventListener('mouseenter', () => {
        if (!stepLabels[i].classList.contains('js-show')) {
          showLabel(stepLabels[i]);
        }
      });

      // set the label back to that of the current step
      steps[i].addEventListener('mouseleave', () => {
        showLabel(currentStep);
      });

      // create link for each step, starting at 1
      addLink(path, steps[i], i+1);
    }
  }

  if (steps && stepLabels && currentStep) {
    setUpStepBar();
  }

});
